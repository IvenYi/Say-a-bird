# 「说只鸟 (Say a Bird)」视觉设计规范 (Design System v2)

> 基于 **frontend-design** 设计理念，并深度提取了参考图片中**“树木”的独特美术风格**。我们将打破常规的“线描+填充” AI 风格，转向一种更具艺术感和秩序感的视觉语言。

---

## 1. 视觉灵魂：几何色块拼贴 (Geometric Flat & Color-Blocking)

参考图片中的树木展现了一种强烈的**矢量扁平 (Flat Vector)** 与**色块拼贴**的美学。
- **无描边 (No Outlines)**：彻底抛弃单线勾勒，物体（无论是树木还是鸟类）的边缘完全由色块的交界来定义。
- **几何化重塑 (Geometric Abstraction)**：圆润的树冠、锐利的松针，将自然形态归纳为柔和或尖锐的几何图形（半圆、三角、波浪）。
- **阶梯式光影 (Stepped Shading)**：不使用平滑的内部渐变，而是通过同色系中 2-3 个明度不同的纯色块叠加（如浅绿树冠 + 中绿枝叶 + 深绿阴影），构建出类似“剪纸重叠 (Paper Cutout)”的立体感。

---

## 2. 调色板 (The Color-Block Palette)

结合 MD 文档的建议与参考图的色彩提取，我们采用**“低饱和自然灰调”**，并且要求所有的填充都必须是**纯色块**。

### 🌳 植被与鸟类资产色 (Asset Colors)
从参考图提取的典型色彩组合（用于鸟类羽毛、三栖基底、记忆森林）：
- **薄荷绿 (Mint Canopy)**: `#A8D5BA` (亮部) / `#81BA95` (暗部)
- **静谧松青 (Deep Pine)**: `#558B8B` (亮部) / `#315B5B` (暗部)
- **落灰粉 (Dusty Pink)**: `#F4B6B6` (亮部) / `#E08A8A` (暗部)
- **暖秋橙 (Autumn Rust)**: `#F4A261` (亮部) / `#D97A3E` (暗部)
- **树干棕 (Trunk Brown)**: `#5D4037` (主色) / `#3E2723` (暗部阴影)

### ☁️ 天空与背景 (The Canvas)
按照 PRD 要求，天空保留柔和的渐变，作为几何色块前景的衬托：
- **清晨 (Dawn)**: `#FDF2F0` → `#E3F2FD`
- **白天 (Day)**: `#E3F2FD` → `#FFFFFF`
- **黄昏 (Dusk)**: `#FFF3E0` → `#FFCCBC`
- **夜晚 (Night)**: `#1A237E` → `#121212`

> **Texture 规则**：在渐变天空图层上方，全局叠加一层 **2-3% 的混合噪点 (Grain Noise)**，使原本扁平的色块产生一种类似“丝网印刷 (Screen Printing)”的复古工艺感。

---

## 3. 字体排印 (Typography)

配合“几何色块”的视觉，字体需要具有足够的结构感和现代感，拒绝孱弱的细体。
- **界面标题 / 数字 (Display & Numbers)**：使用较粗的字重（`PingFang SC Semibold` 或系统自带的粗体），字母和数字可以采用几何感强的英文字体（如 `Montserrat` 或 `Avenir`）。
- **正文 (Body)**：`PingFang SC Regular`。
- **词云 (Word Cloud)**：MD 中提到的“极简手写体”可以被替换或兼容为**略带粗糙边缘的记号笔字体**，以契合色块拼贴的版画感，如 `站酷快乐体`，但要克制使用，作为天空的文字点缀。

---

## 4. 空间与布局 (Spatial Composition)

- **图层重叠 (Overlapping)**：大量运用物体间的遮挡来建立深度（如一只鸟半遮挡着一片树叶块，前端颜色的明度高于后端）。不需要复杂的投影（Shadows），仅靠颜色的明暗对比切分图层。
- **破除网格 (Break the Grid)**：参考图片中树木高低错落、参差不齐的排列。天空中的鸟类、底部的三栖基底，都应避免完美的水平对齐，采用不对称、看似随意但平衡的散落式布局。
- **卡片设计**：UI 卡片（如图鉴、输入框）不要使用烂大街的“大圆角+弥散阴影”。改用：**直角或微圆角 (4px) + 纯色硬阴影 (Solid Hard Shadow)**，例如向右下角偏移 4px 的 `#E0E0E0` 纯色块投影，呼应“色块拼贴”的主题。

---

## 5. UI 组件与前端实现指导 (Frontend Design Specs)

### 5.1 交互组件样式
- **主按钮 ("说只鸟")**：
  摒弃渐变和拟物。使用纯粹的 **柔橙色块 (`#FFAB91`)**，按下时不是变暗，而是使用 CSS `transform: translateY(2px)` 配合消除底部的纯色硬阴影，模拟物理按键的按压感。
- **输入页 (The Nest)**：
  不要可见的输入框边框。将整个下半屏变成一张“纸”，上方是天空，中间是一条粗且柔和的水平色块分割线。

### 5.2 动效 (Motion)
- **鸟类飞入**：不要缓慢的透明度渐变。采用**轻快、有弹性的动效 (Spring / Bounce)**。鸟类作为色块“弹”入屏幕（如 `cubic-bezier(0.34, 1.56, 0.64, 1)`），这与扁平几何画风的“俏皮感”更匹配。

---

## 6. 美术资产制作指令修正 (AI Prompt for Assets)

为了让后续生成的鸟类和三栖基底与这种“树木”风格完美融合，向 AI 绘图工具的 Prompt 必须修改如下：

> **鸟类/基底生成 Prompt**:
> `Flat vector illustration of a [Bird Name / Branch], geometric shapes, color-blocking, paper cutout style, stepped shading, no outlines, pastel and muted natural color palette, minimalistic, clean edges, solid colors, isolated on white background --v 6.0`

*(这确保生成的鸟类没有线条勾边，完全由纯粹的色彩几何块拼接而成，与我们参考的森林树木在同一维度)*

---

## 7. 核心 CSS 变量 (CSS Variables Preview)

```css
:root {
  /* 天空渐变变量保持不变，但 UI 元素转为色块风格 */
  --bg-sky-dawn-1: #FDF2F0;
  --bg-sky-dawn-2: #E3F2FD;
  
  /* 几何色块系统 */
  --color-block-green: #A8D5BA;
  --color-block-green-dark: #81BA95;
  --color-block-orange: #FFAB91;
  --color-block-orange-dark: #E2957C;
  --color-text-title: #2C3E50;
  --color-text-body: #546E7A;

  /* 硬阴影，呼应拼贴画风 */
  --shadow-hard: 4rpx 4rpx 0 rgba(0, 0, 0, 0.08);
  /* 圆角克制 */
  --radius-geometric: 12rpx; 
}

/* 带有颗粒感的渐变天空基础类 */
.sky-canvas {
  background: linear-gradient(to bottom, var(--bg-sky-dawn-1), var(--bg-sky-dawn-2));
  position: relative;
}
.sky-canvas::after {
  content: "";
  position: absolute; inset: 0;
  background-image: url('/assets/images/noise.png'); /* 叠加颗粒图 */
  opacity: 0.03; mix-blend-mode: multiply; pointer-events: none;
}
```