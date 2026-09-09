# Room Interaction Polish

本轮未提交、未推送。预览 http://localhost:3017/other-side 。保留上一轮未提交的 Mobile 优化。

1. 清理浮层：删除 LivingShelf 整段 Html 物件提示，包括默认“查看”、E 提示及物件播放/开关标签。它位于图片墙附近，容易被误认为 Photo Wall 提示。保留底部 Mobile action、内容返回、起身和播放器控制。
2. Photo Wall：直接走原 onPhotoSelect，不再依赖 photoLightboxEnabled 聚焦门槛；去掉整墙透明大命中面及整墙 hover，只有被指向的照片响应；图片轻微提亮、相框低强度暖色 emissive，pointer 光标。拖动不打开照片。
3. Camera：Desktop 横/纵速度 .45/.38 → .4/.34，拖动阻尼 .12 → .15，smoothTime .76 → .48。Desktop azimuth -1.12～.62、polar .78～1.48；Mobile azimuth -1～.5、polar .86～1.43，保留此前较轻的手机灵敏度及坐姿限制。只适度放宽观察，不取消距离和角度限位；并非新增完整碰撞系统。
4. 小物件：灯、唱片、抽屉、植物继续保持自由相机；书本不再调用 returnToExplore 干扰正在进行的镜头。Photo 点击不移动相机，只有 Lightbox 打开期间锁输入。书架原有短暂靠近仍可通过拖动、空白或 ESC 取消。
5. 返回：沿用现有统一控制器，Photo / Childhood / My World / Desk 关闭立即 FREE_EXPLORE 并 unlock，不 router.back、不回默认出生点。Lounge 通过起身过渡返回自由探索。
6. 输入：画布层拖动误点击保护扩展到 Desktop；移动端保留多指/位移/重复 tap 判定。没有新增 window pointer 监听器或第二个相机。
7. ESC：增加受现有控制器管理的临时关闭回调；内容/坐姿优先，歌单其次，抽屉/书本与普通 focus 随后。手机展开歌单 ESC 回迷你条，不停止音乐；再次 ESC 收起迷你条。Desktop ESC 收起播放器。FREE_EXPLORE 不退出页面。
8. 验证：1280px 从总览单击两张不同真实照片成功；按钮关闭与 ESC 都回 FREE_EXPLORE。390px、320px 从总览一次点击打开同样成功，关闭后继续拖动。实际 Desk 聚焦拖动取消成功，歌单 ESC 保留迷你条及播放状态，浏览器 error 日志为空。
9. 自动回归：1280/320/360/390/430px 的相机、内容返回、灯光、椅子、坐姿、生活柜及中断恢复通过；新增 ESC 临时界面优先于抽屉的断言。音频七首路径、切歌、SOUND、seek、ended 与清理回归通过。小屏浏览器指针测试不等同真实手机多点触摸。
10. pnpm build：通过，含编译、类型检查和 32 页静态生成。

## 本轮涉及文件

- components/leo-room/WallDisplays.tsx
- components/leo-room/LivingShelf.tsx
- components/leo-room/RoomCameraControls.tsx
- components/leo-room/RoomTouchSurface.tsx
- components/leo-room/useRoomInteractionController.ts
- components/leo-room/VinylListeningCorner.tsx
- components/OtherSide.tsx
- data/leoRoomCamera.ts
- scripts/room/verify-room-life.cjs
- components/leo-room/INTERACTION_POLISH_REVIEW.md

Room architecture、家具结构、灯光风格及其它页面未改。Git 保持本轮开始时的 HEAD 6578af2。
