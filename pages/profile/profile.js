// pages/profile/profile.js
Page({
  data: {
    userInfo: null,
    stats: {
      totalDiaries: 0,
      unlockedBirds: 0,
      currentStreak: 0
    }
  },

  onLoad() {
    this.loadUserInfo()
    this.loadStats()
  },

  onShow() {
    this.loadStats()
  },

  // 加载用户信息
  async loadUserInfo() {
    try {
      const userInfo = wx.getStorageSync('userInfo')
      if (userInfo) {
        this.setData({ userInfo })
      }
    } catch (error) {
      console.error('加载用户信息失败:', error)
    }
  },

  // 加载统计数据
  async loadStats() {
    try {
      const db = wx.cloud.database()

      // 查询日记总数
      const diariesCount = await db.collection('diaries')
        .where({ isDeleted: false })
        .count()

      // 查询解锁鸟类数
      const birdsCount = await db.collection('gallery')
        .count()

      this.setData({
        'stats.totalDiaries': diariesCount.total,
        'stats.unlockedBirds': birdsCount.total
      })
    } catch (error) {
      console.error('加载统计数据失败:', error)
    }
  },

  // 获取用户信息
  async getUserProfile() {
    try {
      const res = await wx.getUserProfile({
        desc: '用于完善用户资料'
      })

      this.setData({
        userInfo: res.userInfo
      })

      wx.setStorageSync('userInfo', res.userInfo)

      wx.showToast({
        title: '授权成功',
        icon: 'success'
      })
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
  },

  // 查看使用指南
  viewGuide() {
    wx.showModal({
      title: '使用指南',
      content: '1. 每天记录你的情绪\n2. 收集15种本土鸟类\n3. 分享你的情绪天空\n4. 回顾你的情绪历程',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  // 关于我们
  aboutUs() {
    wx.showModal({
      title: '关于说只鸟',
      content: '说只鸟是一款情绪记录小程序，通过中国本土鸟类帮你可视化情绪。\n\n版本：MVP v1.0\n开发者：说只鸟团队',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  // 联系客服
  contactService() {
    wx.showModal({
      title: '联系我们',
      content: '如有问题或建议，请添加客服微信：sayabird',
      showCancel: true,
      confirmText: '复制微信号',
      success: (res) => {
        if (res.confirm) {
          wx.setClipboardData({
            data: 'sayabird',
            success: () => {
              wx.showToast({
                title: '已复制',
                icon: 'success'
              })
            }
          })
        }
      }
    })
  },

  // 清除缓存
  clearCache() {
    wx.showModal({
      title: '清除缓存',
      content: '确定要清除本地缓存吗？不会删除云端数据',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorage({
            success: () => {
              wx.showToast({
                title: '清除成功',
                icon: 'success'
              })
            }
          })
        }
      }
    })
  }
})
