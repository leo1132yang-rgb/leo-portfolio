# Aquascape / Seated View

本轮仅 Room；未提交、未推送。体验地址：http://localhost:3018/other-side。

1. 鱼缸：放在显示器左侧后方，独立于桌面原有 props 的二倍缩放。缸体约 0.94×0.45×0.53 世界单位，保留键盘、水瓶、手办、台灯与绿植位置。透明薄玻璃、水面、砂径、四块石景、三段曲线沉木、72 片实例化水草、三条低面数小鱼；缓慢游动、尾鳍摆动与极轻水面起伏。无折射渲染目标、外部贴图或新增依赖。
2. 交互：点击切明亮/夜间灯，阻尼过渡，无 tooltip、弹窗或小游戏。复用 Room controller 的 aquariumBright / toggleAquarium；手机探索菜单提供鱼缸灯按钮。局部灯独立于全屋灯，关闭全屋灯后仍能保留鱼缸氛围。
3. Sit Mode：原独立拖动仅监听 gl.domElement；现在接到 R3F events.connected（回退 canvas）的捕获阶段，与实际事件容器一致。Orbit 在坐姿仍关闭以禁止离座/缩放，由固定眼点 look-around 更新方向。Desktop 左右最大 ±42°、上下 ±16°；Mobile 左右约 ±33.6°、上下约 ±12.8°。坐下/起身原过渡、ESC 和状态机保留。
4. 宇宙：保留现有银河与慢速薄雾，新增独立深度的 240 个微弱星尘点和低饱和程序行星、两层细行星环。仅窗户 stencil 区域可见，行星深度正确遮挡后侧环。根据实景缩小了行星，降低环透明度，避免抢占窗景。
5. 验证：桌面与 390px 实际点击鱼缸切灯成功；坐姿拖动分别改变 yaw/pitch，起身后 FREE_EXPLORE。新增回归用独立 connected 容器派发 pointer down/move/up，验证目标改变、实际 camera.position 不变；鱼缸切灯不改变相机。1280/320/360/390/430px 回归通过。浏览器 error 日志为空；手机尺寸的桌面浏览器坐姿采样约 60 FPS，不是手机真机性能保证。
6. 最终 pnpm build 结果见交付消息。

## 文件

- components/leo-room/DeskAquascape.tsx（新增）
- components/leo-room/WindowVista.tsx（新增）
- components/leo-room/CentralWorkspace.tsx
- components/leo-room/CosmicBackdrop.tsx
- components/leo-room/RoomCameraControls.tsx
- components/leo-room/useRoomInteractionController.ts
- components/OtherSide.tsx
- data/leoRoomLife.ts
- scripts/room/verify-room-life.cjs
- components/leo-room/AQUASCAPE_REVIEW.md（本记录）

最终 pnpm build 已通过，含类型检查与 32 页静态生成。未暂存、未提交、未推送。
