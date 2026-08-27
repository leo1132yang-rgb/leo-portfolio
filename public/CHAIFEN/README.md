# Childhood Memory Assets

从两张透明素材母版中按原像素裁切整理。未修改网站代码，也未重新设计或重绘插画。

## 使用方法

- 每个素材同时提供 PNG（透明背景优先）与 WebP（网页加载优先）。
- 文件统一使用英文小写 snake_case。
- 网页开发时先查阅 manifest.csv；其中记录类别、用途、相对尺寸和组合素材说明。
- 组合素材表示原母版中的元素相互遮挡或紧密连接，强行拆开会破坏画面。

## 目录

- scenes/：7 个命名素材，每个含 PNG + WebP
- people_animals/：6 个命名素材，每个含 PNG + WebP
- childhood_actions/：7 个命名素材，每个含 PNG + WebP
- food_objects/：14 个命名素材，每个含 PNG + WebP
- map_ui/：14 个命名素材，每个含 PNG + WebP

合计：48 个命名素材，96 个图片文件。

## 透明背景说明

源母版为带 Alpha 通道的 PNG。裁切时保留原始阴影与半透明边缘，并自动去除外围全透明留白。
