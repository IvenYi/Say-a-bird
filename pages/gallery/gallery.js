// pages/gallery/gallery.js
Page({
  data: {
    unlockedBirds: [],
    lockedBirds: [],
    unlockedCount: 0,
    totalCount: 15,
    allBirds: [
      { name: '珠颈斑鸠', emotion: '敷衍/佛系', knowledge: '斑鸠的窝极其敷衍，有时只用三五根树枝' },
      { name: '夜鹭', emotion: '下班状态/疲惫', knowledge: '夜鹭是夜行性鸟类，白天主要负责"思考人生"' },
      { name: '银喉长尾山雀', emotion: '极致治愈', knowledge: '体重仅7-9克，比一枚硬币还轻' },
      { name: '苍鹭', emotion: '极致摸鱼', knowledge: '苍鹭为了等一条鱼可以静止好几个小时' },
      { name: '白鹡鸰', emotion: '忙碌/奔波', knowledge: '走路永远一颠一颠，像在赶时间' },
      { name: '噪鹃', emotion: '委屈', knowledge: '叫声穿透力极强，能传1公里远' },
      { name: '乌鸫', emotion: '深夜emo', knowledge: '乌鸫能模仿超过50种声音' },
      { name: '红嘴蓝鹊', emotion: '愤怒/反击', knowledge: '会集体围攻老鹰，是鸟类界的"帮派老大"' },
      { name: '小䴙䴘', emotion: '社恐', knowledge: '遇到危险时不会飞，会瞬间潜入水中消失' },
      { name: '普通翠鸟', emotion: '专注', knowledge: '俯冲入水捕鱼的时间仅需短短一两秒' },
      { name: '树麻雀', emotion: '平静/日常', knowledge: '最熟悉的城市鸟类，充满烟火气' },
      { name: '小白鹭', emotion: '优雅/释然', knowledge: '繁殖期会长出极其飘逸的"饰羽"' },
      { name: '红隼', emotion: '专注/搞钱', knowledge: '城市中最常见的猛禽，会在空调外机上做窝' },
      { name: '喜鹊', emotion: '小确幸/八卦', knowledge: '非常聪明，能够认出镜子里的自己' },
      { name: '家燕', emotion: '归属/乡愁', knowledge: '每年迁徙可飞行数万公里，却能精准回到旧巢' }
    ]
  },

  onLoad() {
    this.loadGallery()
  },

  onShow() {
    this.loadGallery()
  },

  // 加载图鉴数据
  async loadGallery() {
    wx.showLoading({ title: '加载中...' })

    try {
      const db = wx.cloud.database()

      // 查询已解锁的鸟类
      const res = await db.collection('gallery')
        .orderBy('firstUnlockTime', 'asc')
        .get()

      const unlockedNames = res.data.map(item => item.birdSpecies)

      // 分类已解锁和未解锁的鸟类
      const unlocked = []
      const locked = []

      this.data.allBirds.forEach(bird => {
        const galleryItem = res.data.find(item => item.birdSpecies === bird.name)

        if (galleryItem) {
          unlocked.push({
            ...bird,
            firstUnlockTime: galleryItem.firstUnlockTime,
            unlockCount: galleryItem.unlockCount
          })
        } else {
          locked.push(bird)
        }
      })

      this.setData({
        unlockedBirds: unlocked,
        lockedBirds: locked,
        unlockedCount: unlocked.length
      })

      wx.hideLoading()
    } catch (error) {
      console.error('加载图鉴失败:', error)
      wx.hideLoading()
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },

  // 查看鸟类详情
  viewBirdDetail(e) {
    const { bird } = e.currentTarget.dataset

    if (!bird.firstUnlockTime) {
      wx.showToast({
        title: '记录更多情绪，它就会出现',
        icon: 'none'
      })
      return
    }

    // 跳转到鸟类时间线页面
    this.showBirdTimeline(bird)
  },

  // 显示鸟类时间线
  async showBirdTimeline(bird) {
    wx.showLoading({ title: '加载中...' })

    try {
      const db = wx.cloud.database()

      // 查询该鸟类的所有出现记录
      const res = await db.collection('diaries')
        .where({
          birdSpecies: bird.name,
          isDeleted: false
        })
        .orderBy('createTime', 'desc')
        .limit(50)
        .get()

      wx.hideLoading()

      if (res.data.length === 0) {
        wx.showToast({
          title: '暂无记录',
          icon: 'none'
        })
        return
      }

      // 显示时间线弹窗
      const timelineText = res.data.map((item, index) => {
        const date = this.formatDate(item.createTime)
        return `${index + 1}. ${date} - ${item.emotionType}`
      }).join('\n')

      wx.showModal({
        title: `${bird.name} 的出现记录`,
        content: `共出现 ${res.data.length} 次\n\n${timelineText}`,
        showCancel: false,
        confirmText: '知道了'
      })
    } catch (error) {
      console.error('加载时间线失败:', error)
      wx.hideLoading()
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },

  // 格式化日期
  formatDate(timestamp) {
    if (!timestamp) return ''

    const date = new Date(timestamp)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${month}-${day}`
  },

  // 去记录情绪
  goToInput() {
    wx.navigateTo({
      url: '/pages/input/input'
    })
  }
})
