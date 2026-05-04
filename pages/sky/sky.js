// pages/sky/sky.js
Page({
  data: {
    currentMonth: '',
    viewMode: 'recent', // 'recent' 近7天 | 'all' 全月
    birds: [],
    unlockedCount: 0,
    totalCount: 15,
    backgroundImage: '',
    currentTime: '',
    isRecording: false,
    isTyping: false,
    textContent: '',
    targetView: 'zone-forest' // 初始镜头位置
  },

  onLoad() {
    this.initPage()
    // 初始化动画实例
    this.animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    // 初始镜头缓慢移动到中心
    setTimeout(() => {
      this.setData({ targetView: 'zone-sky' })
    }, 500)
  },

  onShow() {
    this.loadBirds()
  },

  // 初始化页面
  initPage() {
    this.setData({
      currentMonth: this.getCurrentMonth(),
      currentTime: this.getCurrentTimeSlot()
    })
    this.updateBackground()
    this.loadUnlockedCount()
  },

  // 获取当前月份
  getCurrentMonth() {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    return `${year}-${month}`
  },

  // 获取当前时段
  getCurrentTimeSlot() {
    const hour = new Date().getHours()
    if (hour >= 6 && hour < 8) return 'dawn'      // 清晨
    if (hour >= 8 && hour < 17) return 'day'      // 白天
    if (hour >= 17 && hour < 19) return 'dusk'    // 黄昏
    return 'night'                                 // 夜晚
  },

  // 更新背景图（逻辑已移至 WXML 样式绑定）
  updateBackground() {
    // 保持空方法或根据需要处理其他背景逻辑
  },

  // 加载鸟类数据
  async loadBirds() {
    // 暂时使用模拟数据，等云开发配置好后再启用
    this.setData({
      birds: []
    })
    return

    /* 等云开发配置好后取消注释
    wx.showLoading({ title: '加载中...' })

    try {
      const db = wx.cloud.database()
      const _ = db.command

      // 计算时间范围
      let timeFilter = {}
      if (this.data.viewMode === 'recent') {
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        timeFilter = _.gte(sevenDaysAgo)
      }

      // 查询鸟类
      const res = await db.collection('diaries')
        .where({
          isDeleted: false,
          month: this.data.currentMonth,
          ...(this.data.viewMode === 'recent' ? { createTime: timeFilter } : {})
        })
        .orderBy('createTime', 'desc')
        .limit(50)
        .get()

      this.setData({
        birds: res.data
      })

      wx.hideLoading()
    } catch (error) {
      console.error('加载鸟类失败:', error)
      wx.hideLoading()
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
    */
  },

  // 加载解锁数量
  async loadUnlockedCount() {
    // 暂时使用模拟数据
    this.setData({
      unlockedCount: 0
    })
    return

    /* 等云开发配置好后取消注释
    try {
      const db = wx.cloud.database()
      const res = await db.collection('gallery')
        .count()

      this.setData({
        unlockedCount: res.total
      })
    } catch (error) {
      console.error('加载图鉴数量失败:', error)
    }
    */
  },

  // 切换视图模式
  switchViewMode() {
    const newMode = this.data.viewMode === 'recent' ? 'all' : 'recent'
    this.setData({ viewMode: newMode })
    this.loadBirds()
  },

  // ===== 文本输入交互 (In-place Text) =====

  // 打开文字输入遮罩
  openTextInput() {
    wx.vibrateShort()
    this.setData({ isTyping: true })
    this.animation.opacity(1).step()
    this.setData({ fadeInAnimation: this.animation.export() })
  },

  // 关闭文字输入遮罩
  closeTextInput() {
    this.animation.opacity(0).step()
    this.setData({ fadeInAnimation: this.animation.export() })
    setTimeout(() => {
      this.setData({ 
        isTyping: false,
        textContent: '' // 清空内容
      })
    }, 300)
  },

  // 监听文字输入
  onTextInput(e) {
    this.setData({ textContent: e.detail.value })
  },

  // 提交文字并生成鸟类
  submitTextEmotion() {
    if (!this.data.textContent.trim()) return
    
    wx.showLoading({ title: '正在感知思绪...' })
    // TODO: 调用 LLM 处理文本
    setTimeout(() => {
      wx.hideLoading()
      this.closeTextInput()
      this.processEmotionToBird()
    }, 1500)
  },

  // ===== 语音与放空交互 =====

  // 点击鸟类查看日记
  onBirdTap(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/diary/diary?id=${id}`
    })
  },

  // 切换语音记录状态
  toggleVoiceRecord() {
    if (this.data.isRecording) {
      this.stopRecording()
    } else {
      this.startRecording()
    }
  },

  // 开始录音
  startRecording() {
    wx.vibrateShort()
    this.setData({ isRecording: true })
    // TODO: 调用 wx.getRecorderManager() 开始录音
  },

  // 模拟从语音/文本生成鸟类，带生态位随机和镜头平移
  processEmotionToBird() {
    // 模拟生态位分类（高空，中低空，地面，水面）
    const ecoLayers = ['sky', 'forest', 'mudflat', 'water']
    const randomLayer = ecoLayers[Math.floor(Math.random() * ecoLayers.length)]
    
    // 根据生态位生成随机坐标 (单位 vw/vh)
    let posX = 0, posY = 0
    if (randomLayer === 'sky') {
      posX = 50 + Math.random() * 200 // 50vw - 250vw
      posY = 10 + Math.random() * 100 // 10vh - 110vh
    } else if (randomLayer === 'forest') {
      posX = 10 + Math.random() * 60  // 10vw - 70vw
      posY = 150 + Math.random() * 40 // 150vh - 190vh
    } else if (randomLayer === 'mudflat') {
      posX = 150 + Math.random() * 80 // 150vw - 230vw
      posY = 200 + Math.random() * 20 // 200vh - 220vh
    } else { // water
      posX = 10 + Math.random() * 280 // 10vw - 290vw
      posY = 230 + Math.random() * 10 // 230vh - 240vh
    }

    const birdId = Date.now().toString()
    const newBird = {
      _id: birdId,
      isFirstUnlock: true,
      layer: randomLayer,
      x: posX,
      y: posY
    }

    this.setData({
      birds: [...this.data.birds, newBird],
      unlockedCount: Math.min(this.data.unlockedCount + 1, this.data.totalCount)
    }, () => {
      // 延迟触发镜头移动，产生平滑的寻找效果
      setTimeout(() => {
        this.setData({ targetView: `bird-${birdId}` })
      }, 500)
    })

    wx.showToast({
      title: '新鸟儿诞生了',
      icon: 'none'
    })
  },

  // 停止录音并生成鸟类
  stopRecording() {
    wx.vibrateShort()
    this.setData({ isRecording: false })
    
    wx.showLoading({ title: '正在感知情绪...' })
    setTimeout(() => {
      wx.hideLoading()
      this.processEmotionToBird()
    }, 1500)
  },

  // 去图鉴页面
  goToGallery() {
    wx.navigateTo({
      url: '/pages/gallery/gallery'
    })
  },

  // 分享天空
  async shareSky() {
    if (this.data.birds.length < 3) {
      wx.showToast({
        title: '再记录几次情绪，天空会更丰富哦',
        icon: 'none',
        duration: 2000
      })
      return
    }

    wx.showLoading({ title: '生成中...' })

    try {
      // TODO: 调用生成分享图云函数
      wx.hideLoading()
      wx.showToast({
        title: '分享功能开发中',
        icon: 'none'
      })
    } catch (error) {
      console.error('生成分享图失败:', error)
      wx.hideLoading()
      wx.showToast({
        title: '生成失败',
        icon: 'none'
      })
    }
  },

  // 去个人中心
  goToProfile() {
    wx.navigateTo({
      url: '/pages/profile/profile'
    })
  },

  // 长按一键放空
  onLongPressMain() {
    wx.vibrateShort()
    wx.showModal({
      title: '一键放空',
      content: '现在什么都不想说吗？我们可以直接为你记录一次“放空”状态。',
      confirmText: '是的',
      cancelText: '再想想',
      success: (res) => {
        if (res.confirm) {
          this.handleQuickEmpty()
        }
      }
    })
  },

  // 处理快速放空逻辑
  async handleQuickEmpty() {
    wx.showLoading({ title: '正在呼唤鸟儿...' })
    // 这里未来调用 db-manager 创建一条空内容日记
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: '已为你记录一次放空',
        icon: 'success'
      })
      this.loadBirds()
    }, 1500)
  }
})
