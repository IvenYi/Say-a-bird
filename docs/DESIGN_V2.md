# DESIGN_V2.md

> 无描边、带噪点肌理的粉彩绘本风 —— 你的自然系情绪树洞。

## 1. Visual Theme & Atmosphere

**Style**: 无描边粉彩绘本风 (Stroke-less Pastel Picture Book)
**Keywords**: 治愈肌理、物种严谨、克制高级、呼吸感、拼贴美学
**Tone**: 温暖且克制 — NOT 低幼 Q 版、NOT 硬冷科技、NOT 繁复装饰
**Feel**: 像是在一个宁静的午后，翻开一本质感高级的纸质绘本，阳光透过树叶洒在略带粗糙感的纸面上。

**Interaction Tier**: L2 流畅交互 (含轻微贝塞尔曲线路径动画)
**Dependencies**: WXSS Animations + Native WeChat Interaction

## 2. Color Palette & Roles

```css
/* WXSS Variables */
page {
  /* 天空时段背景 (Gradients) */
  --bg-sky-dawn-1: #FDF2F0; --bg-sky-dawn-2: #E3F2FD;
  --bg-sky-day-1: #E3F2FD;   --bg-sky-day-2: #FFFFFF;
  --bg-sky-dusk-1: #FFF3E0;  --bg-sky-dusk-2: #FFCCBC;
  --bg-sky-night-1: #1A237E; --bg-sky-night-2: #121212;

  /* 核心资产色 (Pastel Asset Colors) */
  --color-mint: #A8D5BA;       /* 灰豆绿 */
  --color-mint-dark: #81BA95;
  --color-blue: #87A9BE;       /* 莫兰迪蓝 */
  --color-blue-dark: #6B8EAB;
  --color-warm-orange: #FFAB91; /* 柔橙 */
  --color-paper: #F5F5F5;      /* 纸张白 */
  
  /* 文字与层级 */
  --text-main: #4A4A4A;        /* 暖深灰 */
  --text-secondary: #78909C;   /* 次要灰 */
  
  /* RGB 辅助值 */
  --color-warm-orange-rgb: 255, 171, 145;
  --shadow-color-rgb: 0, 0, 0;
}
```

**Color Rules:**
- **绝对无描边**：所有色块相接处严禁使用 border。
- **低饱和度**：保持 30-50% 的低饱和度，确保视觉长久观看无负担。
- **色彩区隔层级**：依靠色块明暗对比而非线条区分结构。

## 3. Typography Rules

**Font Stack:** "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif

| Role | Size | Weight | Line Height | Letter Spacing |
|------|------|--------|-------------|----------------|
| Hero Title | 48rpx | 600 | 1.4 | 4rpx |
| Section Header | 36rpx | 500 | 1.5 | 2rpx |
| Body Main | 32rpx | 400 | 1.7 | 1rpx |
| Secondary | 28rpx | 300 | 1.6 | 1rpx |
| Captions | 24rpx | 300 | 1.4 | 1rpx |

**Typography Rules:**
- **文字色禁纯黑**：始终使用 `--text-main` (#4A4A4A)。
- **留白呼吸感**：正文行高保持 1.7 以上，减少阅读内耗。

## 4. Component Stylings

### Buttons (Geometric Pill)
```css
.btn-zen {
  background: var(--color-warm-orange);
  color: #FFFFFF;
  border-radius: 100rpx;
  padding: 24rpx 60rpx;
  font-weight: 500;
  box-shadow: 0 16rpx 32rpx rgba(var(--color-warm-orange-rgb), 0.2);
  transition: all 0.3s ease;
}
.btn-zen:active {
  transform: scale(0.96);
  box-shadow: 0 8rpx 16rpx rgba(var(--color-warm-orange-rgb), 0.15);
}
```

### Cards (Zen Card)
```css
.card-zen {
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 40rpx;
  box-shadow: 0 20rpx 40rpx rgba(0, 0, 0, 0.08); /* V2 核心弥散阴影 */
}
```

### Input Area
```css
.input-zen {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 24rpx;
  padding: 30rpx;
}
```

## 5. Layout Principles

**Container:**
- 全屏沉浸式布局，去除所有不必要的分割线。
- **三层天空系统**：高空(0-30%)、林间(30-70%)、地面/水面(70-100%)。

**Spacing Scale:**
- Page Padding: 40rpx
- Component Gap: 30rpx
- Section Gap: 60rpx

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Base | 无阴影，纯色块相接 | 背景元素、基底景观 |
| Floating | 0 10rpx 20rpx rgba(0,0,0,0.05) | 悬浮鸟类、提示气泡 |
| Focus | 0 20rpx 40rpx rgba(0,0,0,0.08) | 交互中心、弹窗、核心按钮 |

## 7. Animation & Interaction

**Motion Philosophy**: 安静、克制、模拟自然物理缓动。

### Entrance Animation (Bird)
```css
@keyframes birdFlyIn {
  from { opacity: 0; transform: translateY(40rpx) scale(0.9); filter: blur(10px); }
  to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}
```

### Special Effects
- **噪点层 (Noise)**：全局 `.noise-overlay` 保持 3% 透明度。
- **丁达尔光 (God Rays)**：`mix-blend-mode: overlay` 叠加柔和光束。

## 8. Do's and Don'ts

### Do
- 坚持**无描边**色块设计。
- 鸟类形态必须保留**生物学特征**（长腿、尖喙等）。
- 保持界面**呼吸感**和留白。
- 使用贝塞尔曲线缓动 `cubic-bezier(0.4, 0, 0.2, 1)`。

### Don't
- ❌ 严禁出现任何 1px 实线描边。
- ❌ 严禁将鸟类画成过度圆润的“球体”。
- ❌ 严禁使用高饱和度、刺眼的对比色。
- ❌ 严禁使用硬阴影（偏移大且无模糊）。
- ❌ 严禁使用过度复杂的立体渐变或高光。
- ❌ 严禁在分享图中使用生硬、乱丢的字体排版。

## 9. Responsive Behavior

**Touch Targets:** 核心交互按钮高度 ≥ 88rpx。
**Safe Area:** 适配异形屏（iPhone 15+）顶部状态栏与底部安全区。
