// pages/onboarding/onboarding.js
Page({
  data: {
    step: 1, // 引导步骤：1-欢迎页 2-首次输入 3-鸟类生成 4-图鉴介绍
    showAnimation: false,
    firstBird: null
  },

  onLoad() {
    // 检查是否已完成引导
    const hasOnboarded = wx.getStorageSync('hasOnboarded')
    if (hasOnboarded) {
      // 已完成引导，跳转到天空页
      wx.redirectTo({
        url: '/pages/sky/sky'
      })
    } else {
      // 显示欢迎动画
      setTimeout(() => {
        this.setData({ showAnimation: true })
      }, 300)
    }
  },

  // 开始首次记录
  startFirstRecord() {
    this.setData({ step: 2 })
  },

  // 跳过引导
  skipOnboarding() {
    wx.showModal({
      title: '确定跳过引导？',
      content: '跳过后可以直接开始使用',
      success: (res) => {
        if (res.confirm) {
          this.completeOnboarding()
        }
      }
    })
  },

  // 完成引导
  completeOnboarding() {
    wx.setStorageSync('hasOnboarded', true)
    wx.redirectTo({
      url: '/pages/sky/sky'
    })
  },

  // 处理首次情绪输入
  async handleFirstInput(content) {
    wx.showLoading({ title: '生成中...' })

    try {
      // 调用情绪分析云函数
      const res = await wx.cloud.callFunction({
        name: 'analyzeEmotion',
        data: { content }
      })

      const emotionResult = res.result

      // 保存首只鸟的信息
      this.setData({
        firstBird: emotionResult,
        step: 3
      })

      // 显示鸟类生成动画
      setTimeout(() => {
        this.setData({ showAnimation: true })
      }, 500)

      wx.hideLoading()
    } catch (error) {
      console.error('情绪分析失败:', error)
      wx.hideLoading()
      wx.showToast({
        title: '生成失败，请重试',
        icon: 'none'
      })
    }
  },

  // 查看图鉴介绍
  showGalleryIntro() {
    this.setData({ step: 4 })
  },

  // 完成引导并保存首只鸟
  async finishOnboarding() {
    if (!this.data.firstBird) {
      this.completeOnboarding()
      return
    }

    wx.showLoading({ title: '保存中...' })

    try {
      // 保存首只鸟到数据库
      const db = wx.cloud.database()
      await db.collection('diaries').add({
        data: {
          content: '我的第一只鸟',
          emotionType: this.data.firstBird.emotion_type,
          intensity: this.data.firstBird.intensity,
          posture: this.data.firstBird.posture,
          keywords: this.data.firstBird.keywords,
          createTime: db.serverDate(),
          month: this.getCurrentMonth(),
          isGuardian: false,
          isDeleted: false
        }
      })

      wx.hideLoading()
      this.completeOnboarding()
    } catch (error) {
      console.error('保存失败:', error)
      wx.hideLoading()
      // 即使保存失败也允许继续
      this.completeOnboarding()
    }
  },

  // 获取当前月份
  getCurrentMonth() {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    return `${year}-${month}`
  }
})
