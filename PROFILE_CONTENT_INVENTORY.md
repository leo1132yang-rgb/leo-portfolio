# Profile Content Inventory

> Scope: `/profile` redesign preparation only. This file records content before any new visual or route implementation.
> Workspace: `C:\Users\Zachary\Desktop\Leol Assets`

## 1. Current public Profile content

Current route: `app/profile/page.tsx` → `components/CareerProfile.tsx`.

- Page identity: `02 / PROFILE`, `个人履历 / Career Profile`, `2015 — NOW`, `CAREER ARCHIVE`.
- Seven chronology sections are present in the current component.
- The current page already contains a Chinese and English language switch through `LanguageProvider`.
- Chapter 07 currently includes four grouped duties: event / content delivery, offline communication, WeCom backend management, online learning and AI knowledge-base work.
- Current footer navigation is provided by `components/AboutChapter.tsx`.

## 2. Legacy Journey content retained in code

Legacy component: `components/JourneySection.tsx`.

It is not the public `/journey` route: `app/journey/page.tsx` redirects to `/profile`. The component remains as a content reference and contains detail that must be preserved in the redesign:

- Longer Chinese and English paragraphs for all seven stages.
- Stage summaries and capability conclusions: observation, visual expression, narrative, brand awareness, method building, execution experience, systems thinking.
- Six cross-stage capabilities: observation, narrative, execution, collaboration, structure and integration.
- The former Journey interaction, cards, bridges and stage navigator are **not** content requirements and must not be carried into the new design.

## 3. Confirmed career record — preserve without deleting facts

### 01 · 2015—2018 · 摄影工作室学习与个人创作

- Entered a photography studio and continued personal photography work.
- Built observation of image, light, people and live scenes.
- Confirmed abilities: 画面观察、光线判断、人物观察、现场感知、个人创作意识.
- English anchor: Photography Studio Learning & Personal Creation.

### 02 · 2018.09—2022.06 · 本科 · 摄影专业

- Systematic photography study.
- Preserve: 摄影实践、视觉表达、影像语言、创作方法、作品制作、画面组织、个人摄影创作.
- English anchor: Bachelor’s Degree · Photography.

### 03 · 2022.09—2023.09 · 研究生 · 创意写作专业

- Preserve: 舞台剧、动画、剧本、脚本、人物传记、故事结构、人物塑造、叙事节奏、内容组织.
- English anchor: Master’s Degree · Creative Writing.

### 04 · 2023.09—2024.01 · 开始进入品牌运营

- Brought photography, visual, content and narrative skills into brand contexts.
- Preserve learning around: 传播目标、品牌表达、现场执行、团队协作、内容落地.
- English anchor: Entering Brand Operations.

### 05 · 2024.01—2024.06 · 个人创作与新媒体运营学习

- Continued refining photography and personal work.
- Preserve: 新媒体运营、内容传播、平台思维、品牌运营知识、作品整理.
- English anchor: Personal Creation & New Media Operations Learning.

### 06 · 2024.07—2025.07 · 品牌助理

- Preserve all work: 视觉摄影、大型活动摄影、大会摄影、视频剪辑、视觉内容制作、平台运营、品牌活动执行、日常内容输出.
- English anchor: Brand Assistant.

### 07 · 2025.08—至今 · 网络运营部主管

Role title: `网络运营部主管 / Network Operations Lead`.

**Brand and event responsibilities — must remain readable:**

- 策划团队大小型活动.
- 输出视觉设计海报、活动海报与现场物料.
- 规划办公室线下展位与办公室宣传内容.
- 负责大型现场活动拍摄.
- 协调团队视频、文章与公告输出.

**System and operations responsibilities — must remain readable:**

- 从 0 到 1 搭建约 500 人企业微信后台架构.
- 企业微信后台日常管理、维护与 IT 问题支持.
- 搭建面向 500+ 前线同事的线上学习体系.
- 整理 AI 知识库并推动 AI 工作流.
- 协调内容、平台与团队运转，推动系统化运营协作.

Restriction: the WeCom case may appear as real work history only. It must not create a public case link while the project entry is hidden.

## 4. Existing bilingual copy sources

| Source | Status | Notes |
| --- | --- | --- |
| `components/CareerProfile.tsx` | Current | Concise CN/EN copy for all seven stages and current role. |
| `components/JourneySection.tsx` | Legacy reference | Longer CN/EN paragraphs, summaries and capability copy. |
| `data/aboutSections.ts` | Current navigation | Profile name and introductory CN/EN description. |
| `data/content.ts` | Supporting reference | Capability vocabulary, brand language and broader professional scope. |

## 5. Repetition and consolidation notes

- Stages 01–02 both mention photography. Keep both, but distinguish **observation / studio practice** from **formal visual language / education**.
- Stages 04–06 all mention brand work. Keep the progression: **brand context → learning and refinement → daily delivery**.
- Stages 06–07 both mention events and platform work. Keep stage 06 focused on hands-on execution; stage 07 focused on responsibility, coordination and systems.
- AI workflow, WeCom and knowledge-base content belongs primarily to stage 07; it should not be scattered across earlier stages.

## 6. Suspected missing or under-rendered content

The current concise Profile omits or compresses the following confirmed details and the redesign must restore them in readable form:

- Stage 01: composition and personal-creation awareness.
- Stage 02: image language, work production and image organisation.
- Stage 03: stage play, animation, biography and character-building specifics.
- Stage 05: platform thinking and brand-operation knowledge.
- Stage 06: conference photography, visual content production and daily content output.
- Stage 07: office booth planning, IT support, all 500 / 500+ system facts, and full content coordination scope.

## 7. Components and route files in scope

- `app/profile/page.tsx` — public Profile route.
- `app/journey/page.tsx` — legacy redirect to `/profile`.
- `components/CareerProfile.tsx` — current public Profile body.
- `components/JourneySection.tsx` — legacy content reference; do not publicly render it.
- `components/AboutChapter.tsx` — Profile frame, language switch and bottom navigation.
- `components/HomeOverview.tsx` — homepage 02 entry.
- `data/aboutSections.ts` — homepage chapter label and href mapping.
- `app/globals.css` — current Profile and legacy Journey styling.

## 8. Potential visual assets — audit only, not approved for automatic use

| Asset group | Candidate paths | Safe use hypothesis |
| --- | --- | --- |
| Personal portrait | `public/images/leo-profile.jpg` | Optional cover portrait only; not required for the archive. |
| Event documentation | `public/cases/annual-dinner/04_selected-assets/*` | Candidate for stage 06 / 07 only after image review and user approval. |
| Event video covers | `public/projects/videos/event-highlights/covers/*` | Candidate for stage 06 only after review; do not auto-load the whole collection. |
| Poster works | `public/projects/poster-design/event-ad-posters/*`, `course-posters/*` | Candidate evidence of visual production, not a substitute for career-stage photography. |
| Brand-event visual materials | `public/projects/visual-materials/OKX/*`, `FUTU/*` | Candidate for brand-practice evidence only after review. |

No verified personal photography archive folder was found beyond the existing portfolio materials. Do not fabricate historical work images.

## 9. Hidden but protected items

- `/projects/platform` and `/cases/wechat-system` remain non-public for V1.
- WeCom platform facts remain protected Profile content, without a public case link.
- Existing `JourneySection` source can remain as a temporary content reference until the new Profile is accepted; it must not be reconnected to public routes.

## 10. Items requiring user confirmation before visual production

1. Whether any annual-dinner, event-highlight, poster, OKX or FUTU asset may appear on the Profile page as documentary evidence.
2. Whether the existing portrait may appear on the Profile cover.
3. Whether the Profile should use only abstract CSS/image placeholders in the first reference round.
4. Whether English should use `Network Operations Lead` (current natural translation) as the official stage 07 title.
