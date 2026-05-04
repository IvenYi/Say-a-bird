# 说只鸟（Say a Bird）- MVP 开发文档

## 项目概述

「说只鸟」是一款通过情绪日记生成中国本土网感鸟类插画、积累个人专属"情绪天空"的微信小程序。

**版本**: MVP v1.0  
**技术栈**: 微信小程序原生开发 + 云开发（CloudBase）  
**开发周期**: 3周

---

## 项目结构

```
Say-a-bird/
├── pages/                      # 页面目录
│   ├── onboarding/            # 首次引导页
│   ├── sky/                   # 天空画布（首页）
│   ├── input/                 # 情绪输入页
│   ├── diary/                 # 日记详情页
│   ├── gallery/               # 鸟类图鉴页
│   └── profile/               # 个人中心页
├── utils/                      # 工具类
│   ├── bird-config.js         # 鸟类配置（15种）
│   ├── bird-mapper.js         # 鸟类映射引擎
│   ├── db-manager.js          # 数据库操作封装
│   └── time-helper.js         # 时间处理工具
├── cloudfunctions/            # 云函数
│   └── analyzeEmotion/        # 情绪分析（已完成）
├── assets/                    # 静态资源
│   ├── images/                # 图片资源
│   │   ├── birds/            # 鸟类插画（30张）
│   │   ├── bg-dawn.png       # 清晨背景
│   │   ├── bg-day.png        # 白天背景
│   │   ├── bg-dusk.png       # 黄昏背景
│   │   ├── bg-night.png      # 夜晚背景
│   │   └── ecology-base.png  # 三栖基底
│   └── icons/                 # 图标资源
├── app.js                     # 小程序入口
├── app.json                   # 全局配置
└── project.config.json        # 项目配置

```

---

## 核心功能模块

### 1. 首次引导（Onboarding）
- **路径**: `pages/onboarding/`
- **功能**: 
  - 欢迎页展示
  - 引导用户完成第一次情绪记录
  - 展示鸟类生成过程
  - 介绍图鉴收集目标

### 2. 天空画布（Sky）
- **路径**: `pages/sky/`
- **功能**:
  - 展示用户的情绪天空
  - 四时段背景自动切换（清晨/白天/黄昏/夜晚）
  - 鸟类按生态位分层展示
  - 收集进度条显示
  - 近7天/全月视图切换

### 3. 情绪输入（Input）
- **路径**: `pages/input/`
- **功能**:
  - 文字输入情绪
  - 语音输入（待实现）
  - 一键放空（长按1秒）
  - 调用云函数分析情绪
  - 生成对应鸟类

### 4. 日记详情（Diary）
- **路径**: `pages/diary/`
- **功能**:
  - 查看完整日记内容
  - 展示鸟类信息和知识
  - 删除日记（软删除）

### 5. 鸟类图鉴（Gallery）
- **路径**: `pages/gallery/`
- **功能**:
  - 展示已解锁/未解锁鸟类
  - 显示收集进度
  - 查看鸟类出现时间线
  - 鸟类知识科普

### 6. 个人中心（Profile）
- **路径**: `pages/profile/`
- **功能**:
  - 用户信息展示
  - 统计数据（记录次数、解锁鸟类）
  - 使用指南、关于我们、联系客服
  - 清除缓存

---

## 数据库设计

### 1. diaries（日记表）
```javascript
{
  _id: "auto",
  _openid: "string",
  content: "string",           // 日记内容
  emotionType: "string",       // 情绪类型
  intensity: number,           // 情绪强度 1-5
  posture: "string",           // 姿势：栖息/展翅/缩头
  keywords: ["string"],        // 关键词数组
  birdSpecies: "string",       // 鸟类品种
  birdImageUrl: "string",      // 鸟类图片URL
  ecologyLayer: "string",      // 生态位
  positionX: number,           // X坐标 %
  positionY: number,           // Y坐标 %
  isFirstUnlock: boolean,      // 是否首次解锁
  createTime: timestamp,
  month: "string",             // 所属月份 "2026-05"
  isGuardian: boolean,         // 是否为守护鸟
  isDeleted: boolean
}
```

### 2. gallery（图鉴表）
```javascript
{
  _id: "auto",
  _openid: "string",
  birdSpecies: "string",       // 鸟类品种
  firstUnlockTime: timestamp,  // 首次解锁时间
  unlockCount: number          // 解锁次数
}
```

### 3. users（用户表）
```javascript
{
  _id: "auto",
  _openid: "string",
  nickName: "string",
  avatarUrl: "string",
  createTime: timestamp,
  lastLoginTime: timestamp
}
```

---

## 15种MVP鸟类清单

| # | 鸟类品种 | 核心情绪 | 生态位 |
|---|---------|---------|--------|
| 1 | 珠颈斑鸠 | 敷衍/佛系 | 中低空 |
| 2 | 夜鹭 | 下班状态/疲惫 | 中低空 |
| 3 | 银喉长尾山雀 | 极致治愈 | 中低空 |
| 4 | 苍鹭 | 极致摸鱼 | 近地面 |
| 5 | 白鹡鸰 | 忙碌/奔波 | 近地面 |
| 6 | 噪鹃 | 委屈 | 中低空 |
| 7 | 乌鸫 | 深夜emo | 近地面 |
| 8 | 红嘴蓝鹊 | 愤怒/反击 | 近地面 |
| 9 | 小䴙䴘 | 社恐 | 水面 |
| 10 | 普通翠鸟 | 专注 | 中低空 |
| 11 | 树麻雀 | 平静/日常 | 近地面 |
| 12 | 小白鹭 | 优雅/释然 | 高空 |
| 13 | 红隼 | 专注/搞钱 | 高空 |
| 14 | 喜鹊 | 小确幸/八卦 | 中低空 |
| 15 | 家燕 | 归属/乡愁 | 高空 |

**素材需求**: 15种 × 2姿势 = 30张PNG透明底插画

---

## 开发进度

### ✅ 已完成（Day 1-2）
- [x] 项目结构搭建
- [x] 所有页面文件创建（6个页面）
- [x] 页面路由配置（app.json）
- [x] TabBar配置
- [x] 工具类开发
  - [x] bird-config.js（鸟类配置）
  - [x] bird-mapper.js（映射引擎）
  - [x] db-manager.js（数据库封装）
  - [x] time-helper.js（时间工具）
- [x] 云函数 analyzeEmotion（情绪分析）

### 🚧 进行中
- [ ] 素材准备（30张鸟类插画 + 背景图）
- [ ] 数据库集合创建
- [ ] 页面功能完善

### 📋 待开发（Day 3-21）
- [ ] Canvas天空渲染引擎
- [ ] 鸟类飞入动画
- [ ] 首次解锁特效
- [ ] 分享功能（天空截图+词云）
- [ ] 月度迁徙机制
- [ ] 微信登录集成
- [ ] 完整测试

---

## 环境配置

### 1. 云开发环境
- **环境ID**: `cloud1-d4gxofamt1a20748c`
- **已配置**: 云函数 analyzeEmotion

### 2. API密钥（需配置）
在云函数环境变量中配置：
- `DEEPSEEK_API_KEY`: DeepSeek API密钥（主力LLM）
- `KIMI_API_KEY`: Kimi API密钥（备用LLM）

### 3. 数据库集合（需创建）
在云开发控制台创建以下集合：
- `diaries`（日记表）
- `gallery`（图鉴表）
- `users`（用户表）

---

## 素材清单

### 必需素材（优先级P0）

#### 1. 鸟类插画（30张）
- 格式：PNG透明底
- 尺寸：建议 800x800px
- 风格：极简线条治愈风
- 命名规范：`{拼音}_{姿势}.png`
  - 例：`zhujingbanjiu_rest.png`（珠颈斑鸠-栖息）

#### 2. 背景图（4张）
- `bg-dawn.png`（清晨橙粉背景）
- `bg-day.png`（白天明蓝背景）
- `bg-dusk.png`（黄昏暖金背景）
- `bg-night.png`（夜晚深蓝背景）
- 尺寸：750x1334px（小程序标准）

#### 3. 三栖基底（1张）
- `ecology-base.png`
- 包含：左侧树枝、中间水面、右侧滩涂
- 占画布底部15%

#### 4. 图标资源
- TabBar图标（6张：3个tab × 2状态）
- 功能图标（分享、图鉴、删除等）

---

## 开发注意事项

### 1. 性能优化
- 天空画布默认显示近7天，避免同屏渲染过多鸟类
- 鸟类图片使用云存储CDN加速
- 合理使用缓存机制

### 2. 异常处理
- LLM API调用失败时使用本地兜底映射
- 网络异常时内容本地缓存
- 触发敏感词汇时展示关怀提示

### 3. 数据安全
- 日记内容仅用户本人可见
- 使用云开发权限管理
- 分享图不包含完整日记内容

### 4. 用户体验
- 情绪记录永远免费，不限次数
- 单日防刷上限：50次/天
- 引导流程简洁流畅

---

## 下一步行动

### 立即启动
1. ✅ 完成页面结构搭建
2. 🎨 **准备30张鸟类插画**（可使用AI绘图工具）
3. 🎨 **设计4张天空背景图**
4. 💾 **创建云数据库集合**
5. 🔌 **配置LLM API密钥**

### 第1周目标（Day 3-7）
- 完成天空画布Canvas渲染
- 完成情绪输入与鸟类生成流程
- 完成数据库读写逻辑

### 第2周目标（Day 8-14）
- 完成图鉴收集系统
- 完成日记管理功能
- 完成收集进度反馈

### 第3周目标（Day 15-21）
- 完成分享功能
- 完成月度迁徙机制
- 完成整体测试与优化

---

## 联系方式

**开发者**: 说只鸟团队  
**版本**: MVP v1.0  
**更新日期**: 2026-05-02

---

## 附录

### 常用命令
```bash
# 上传云函数
# 在微信开发者工具中右键云函数目录 -> 上传并部署

# 查看云函数日志
# 云开发控制台 -> 云函数 -> 日志

# 数据库操作
# 云开发控制台 -> 数据库
```

### 参考文档
- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
- [DeepSeek API文档](https://platform.deepseek.com/docs)
