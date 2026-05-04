# 素材准备说明

本目录用于存放「说只鸟」小程序的所有静态资源。

## 目录结构

```
assets/
├── images/              # 图片资源
│   ├── birds/          # 鸟类插画（30张）
│   ├── bg-dawn.png     # 清晨背景
│   ├── bg-day.png      # 白天背景
│   ├── bg-dusk.png     # 黄昏背景
│   ├── bg-night.png    # 夜晚背景
│   └── ecology-base.png # 三栖基底
└── icons/              # 图标资源
    ├── tab-sky.png
    ├── tab-sky-active.png
    ├── tab-gallery.png
    ├── tab-gallery-active.png
    ├── tab-profile.png
    └── tab-profile-active.png
```

## 鸟类插画命名规范

### 15种鸟类 × 2姿势 = 30张

1. **珠颈斑鸠**
   - zhujingbanjiu_rest.png（栖息）
   - zhujingbanjiu_fly.png（展翅）

2. **夜鹭**
   - yelu_rest.png（栖息）
   - yelu_tired.png（缩头）

3. **银喉长尾山雀**
   - yinhoumaque_rest.png（栖息）
   - yinhoumaque_fly.png（展翅）

4. **苍鹭**
   - canglu_rest.png（栖息）
   - canglu_fly.png（展翅）

5. **白鹡鸰**
   - baijiling_rest.png（栖息）
   - baijiling_fly.png（展翅）

6. **噪鹃**
   - zaojuan_rest.png（栖息）
   - zaojuan_sad.png（缩头）

7. **乌鸫**
   - wudong_rest.png（栖息）
   - wudong_emo.png（缩头）

8. **红嘴蓝鹊**
   - hongzuilanque_rest.png（栖息）
   - hongzuilanque_angry.png（展翅）

9. **小䴙䴘**
   - xiaopiti_rest.png（栖息）
   - xiaopiti_hide.png（缩头）

10. **普通翠鸟**
    - putongcuiniao_rest.png（栖息）
    - putongcuiniao_focus.png（展翅）

11. **树麻雀**
    - shumaque_rest.png（栖息）
    - shumaque_fly.png（展翅）

12. **小白鹭**
    - xiaobailu_rest.png（栖息）
    - xiaobailu_elegant.png（展翅）

13. **红隼**
    - hongsun_rest.png（栖息）
    - hongsun_hunt.png（展翅）

14. **喜鹊**
    - xique_rest.png（栖息）
    - xique_happy.png（展翅）

15. **家燕**
    - jiayan_rest.png（栖息）
    - jiayan_fly.png（展翅）

## 素材规格要求

### 鸟类插画
- **格式**: PNG（透明底）
- **尺寸**: 800x800px
- **风格**: 极简线条治愈风
- **色彩**: 柔和自然色系

### 背景图
- **格式**: PNG/JPG
- **尺寸**: 750x1334px（小程序标准屏幕尺寸）
- **风格**: 渐变天空，柔和过渡
- **色调**:
  - 清晨：橙粉色调
  - 白天：明亮蓝色
  - 黄昏：暖金色调
  - 夜晚：深蓝紫色

### 三栖基底
- **格式**: PNG（透明底）
- **尺寸**: 750x200px（占屏幕底部15%）
- **内容**: 左侧树枝、中间水面、右侧滩涂
- **风格**: 极简线条，与鸟类插画风格一致

### 图标
- **格式**: PNG（透明底）
- **尺寸**: 
  - TabBar图标：81x81px
  - 功能图标：48x48px
- **风格**: 线性图标，简洁清晰

## AI绘图工具推荐

### Midjourney Prompt 示例
```
A minimalist line art illustration of a [鸟类名称], 
Chinese native bird, healing style, simple lines, 
soft colors, white background, transparent PNG, 
800x800px, [栖息/展翅/缩头] posture
```

### Stable Diffusion Prompt 示例
```
minimalist bird illustration, [鸟类名称], 
line art, healing aesthetic, simple design, 
soft pastel colors, white background, 
high quality, 8k, clean lines
```

## 临时占位图

在素材未准备好之前，可以使用以下占位图：
- 鸟类：`placeholder.png`（统一占位图）
- 背景：纯色渐变（代码中临时生成）

## 素材上传

准备好素材后，需要上传到云存储：
1. 打开微信开发者工具
2. 云开发控制台 -> 云存储
3. 创建文件夹：`bird-assets/`、`backgrounds/`
4. 上传对应素材
5. 获取文件URL，更新 `bird-config.js` 中的路径

---

**注意**: 所有素材需符合微信小程序内容规范，不得包含违规内容。
