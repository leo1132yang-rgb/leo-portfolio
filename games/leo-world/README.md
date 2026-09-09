# Leo 的开放世界

在 `codex/leo-open-world` 分支中新增的独立驾驶版个人网站。访问 `/open-world`，或在 Leo’s Room 点击后墙电视，再点击电视或选择“进入开放世界 · 开车出发”。中间电脑保持原来的控制台内容和数字工作室入口。

这是对 Bruno Simon [Folio 2025](https://github.com/brunosimon/folio-2025) 的 MIT 许可改编，使用其完整世界、渲染、车辆物理和小游戏架构。它不是从零重做的同款场景。导入版本：`41046b57eeed8d156d9c3fd7fa259900baef7816`。版权和许可见 [LICENSE](LICENSE)。

## 这一版的内容

- 中文启动页、旅行手册、地图地点、操作指南和探索成就。
- 同步网站的 7 段履历、6 类作品、29 张真实照片、童年故事、旅行坐标与能力资料。照片沿用原 `src` / `thumbnailSrc` / `previewSrc`。
- 默认珍珠白电动轿车，另有山野拉力车、双拼露营车。车身通过代码建模，共享原有车轮和 Rapier 底盘，保留换车前的位置。电动车采用特斯拉风格的设计语言，不是特斯拉官方模型。
- 保留原作驾驶、跳跃、加速、鸣笛、保龄球、赛道、碰撞物件、隐藏区域和成就；增加十地探索护照、本机圈速及旅途便签。
- 暖日光、草木、河流、瀑布、天气与缓慢昼夜变化。手机自动降低画质和像素比。

真实资料来自网站现有数据；“策划／创作／执行”是作品分类的通用标签，不代表新增履历事实。没有伪造在线玩家或排行榜。进度保存在当前浏览器，清理浏览器数据会清除存档。世界中的基础环境美术、声音和物理实现属于上游贡献，不能当作 Leo 自制的作品履历。

## 运行与构建

项目根目录执行：

```sh
pnpm build
pnpm start --port 3022
```

打开 `http://localhost:3022/open-world`。根构建会自动为本目录安装锁定依赖、同步网站资料，再生成 `public/world`，最后构建 Next.js。`public/world` 是生成文件，不提交 Git。全新构建需要网络安装依赖。

日常预览：先 `pnpm build:world`，再启动原网站的开发服务。修改游戏源代码时，可另开 `pnpm dev:world`（3020 端口）；其网站图片和站内链接默认代理到 3000 端口，使用其他端口时设置 `LEO_PORTFOLIO_URL`。

游戏使用独立的 Three.js / Vite 依赖，不升级 Room 的 Three.js。入口是整页导航，离开 Room 后卸载原 Canvas，游戏只创建一个 renderer。

## 操作

WASD／方向键驾驶，Shift 加速，空格跳跃，B 刹车，R 脱困，回车互动，G 车库，Escape 关闭面板。手机单指拖动驾驶，双指调整视角；互动使用场景按钮。

## 文件位置

- `sources/leo/`：中文 UI、个人内容页面、车型和内容纹理。
- `sources/Game/`：上游游戏引擎及必要适配。
- `sources/data/leo.js`、`projects.js`、`lab.js`：根目录 `scripts/sync-world-content.cjs` 从真实资料生成，勿手工维护重复数据。
- `static/`：上游压缩场景、纹理、字体、音效，已去掉约 130 MB 未使用的 WAV 原文件。
- 根目录 `scripts/world/verify-open-world.cjs`：浏览器交互验证。

## 验证方式

浏览器测试需要 Playwright 与 Chrome。通过 `PLAYWRIGHT_MODULE` 指定 Playwright 模块位置，`WORLD_TEST_URL` 指定本地网站地址，运行 `node scripts/world/verify-open-world.cjs`。结果和截图写入被忽略的 `.tools/world-proof/`。

测试覆盖键盘／触控驾驶、车型切换、履历／照片／记忆、便签保存、地图传送、项目面板关闭与驾驶恢复、赛道启动和计时反馈。手机为触控模拟，不等同于真机性能测试；赛道测试验证启动和终点回调，没有用自动脚本完整驾驶一圈。

基础场景和游戏资源约 64 MB，首次进入比原网站普通页面更重。使用压缩模型与纹理、实例化植被、按区加载内容；不加载 Blender 或第二个渲染器。画质可在设置中切换。
