# 手机连续浏览验收记录

本轮范围：手机主页面的四个一级板块串联。2026-09-18 用户授权提交并推送；摄影、文字作品、童年与足迹模块的独立改造不包含在这次提交中。

## 页面与交互

- 小于 768px 时，首页只挂载一个手机页面，顺序为封面 → 个人履历 → 项目作品 → 我的世界封面。只有一套导航、一个 main 和一个页脚。
- 四段共用浏览器原生纵向滚动；履历和项目按内容延长，没有滚动吸附、内部滚动窗口或滚动模拟路由。章节导航使用原生平滑定位，减少动态效果设置下直接定位。
- 手机首页静音；封面视频离开视口或页面进入后台后暂停。我的世界封面只显示已有背景和邀请文案，不创建 Canvas、不提前请求 Room 模型、不启动游戏。
- 手机点击“进入我的世界”后进入 `/other-side?enter=1&from=mobile-home`，复用现有 Room 加载流程，跳过第二次邀请封面。加载期间保留返回入口；退出回 `/#world` 并恢复位置。
- 作品详情 URL 保留。手机从作品分类返回时定位 `/#projects`，恢复筛选与滚动位置；浏览器后退也能恢复离开时的位置，即使此前 URL 中仍是其他章节的锚点。直接访问、刷新作品页后有稳定的项目章节返回目标。
- 自然滚动不修改 URL 或新增历史。章节快捷定位使用 replaceState。电脑端保留独立首页、履历、项目与原我的世界入口。

## 复用内容

- `LeoHero`：原封面信息、头像、工具与视觉；手机嵌入时移除重复导航。
- `EvolvingProfile`：原七段经历、日期、机构、城市、职位及纵向档案布局，继续读取现有履历数据。
- `ProjectsIndex`：原六个分类、顺序、筛选及作品入口，详情未展开到首页。
- `WorldInvitation`：从原 `OtherSideEntry` 提取已有邀请文案与按钮；手机和电脑共享 `worldIntroCopy`。
- 继续使用现有 `LanguageProvider`、`SiteNavbar`、`SiteFooter` 与 Room 体验。

## 修改文件

新增：

- `components/mobile/ResponsiveHome.tsx`
- `components/mobile/MobileJourney.tsx`
- `components/mobile/MobileJourney.module.css`
- `components/mobile/MobileJourneyNavigation.tsx`
- `components/other-side/WorldInvitation.tsx`
- `hooks/useMobileViewport.ts`
- `lib/mobileJourney.ts`
- `scripts/mobile-journey/preview.cjs`
- `scripts/mobile-journey/verify-browser.cjs`
- `scripts/mobile-journey/verify-return.cjs`

调整：

- `app/page.tsx`、`app/layout.tsx`、`app/other-side/page.tsx`
- `components/LeoHero.tsx`、`components/ProjectsIndex.tsx`、`components/ProjectBackButton.tsx`
- `components/profile/EvolvingProfile.tsx`、`components/profile/TimelineArchive.module.css`
- `components/layout/SiteNavbar.tsx`、`components/layout/SiteFooter.tsx`
- `components/other-side/OtherSideEntry.tsx`、`components/other-side/OtherSideEntry.module.css`
- `components/OtherSide.tsx`：仅增加可传入的退出目标。
- `components/audio/GlobalAudioProvider.tsx`、`components/audio/SoundToggle.tsx`：手机连续首页的静音与控件显示。

没有清空工作区或回退并行修改。保护校验中 127 份源码/数据保持原样（含 Childhood、摄影、文字作品与原文案）。依赖清单和锁文件在工作期间出现外部变化，本轮未写入或回退它们。

## 已执行验证

- TypeScript 检查通过；最终 `pnpm build` 通过，包含既有 open-world 构建。
- 320px、390px、430px 的中文/英文浏览器检查：七段经历、四段顺序、原生触摸及滚动、无横向溢出、单导航/主体/页脚、筛选与返回位置。
- 390px 实际进入现有 WebGL Room，确认没有重复邀请；退出后恢复世界封面位置，音频暂停。使用桌面 Chrome 的移动视口与软件 WebGL，非真实手机性能测试。
- 浏览器后退与直接打开、刷新文字作品分类页的返回检查通过。
- 1440px：首页、履历、项目独立路由回归通过。原我的世界入口中英文、进入 Room、打开与关闭 Travel Globe 回归通过。
- 既有 `verify-vinyl-audio.cjs` 通过，`scripts/photography/verify-core.cjs` 5/5 通过。
- 截图与结果位于 `artifacts/mobile-journey/`。

## 待用户确认与其他观察

- 尚未使用真实 iPhone/Safari、Android 手机测试惯性滚动、缩放及 GPU 性能，视觉手感需用户手机确认。
- 本地生产预览为 `http://127.0.0.1:3009`。局域网开放被自动审批拒绝，原因是同网其他设备也会获得访问能力；尚未为手机直连开放新预览端口。
- 本轮未扩展修改：部分独立项目/案例页同时存在两个返回入口，可另行统一；全局样式有较多历史覆盖，可另行整理。这两项不改变当前四段浏览主线。
