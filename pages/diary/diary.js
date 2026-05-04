// pages/diary/diary.js
Page({
  data: {
    diaryId: '',
    diary: null,
    birdInfo: null
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ diaryId: options.id })
      this.loadDiary()
    }
  },

  // 加载日记详情
  async loadDiary() {
    wx.showLoading({ title: '加载中...' })

    try {
      const db = wx.cloud.database()
      const res = await db.collection('diaries')
        .doc(this.data.diaryId)
        .get()

      if (res.data) {
        this.setData({
          diary: res.data,
          birdInfo: this.getBirdInfo(res.data.birdSpecies)
        })
      }

      wx.hideLoading()
    } catch (error) {
      console.error('加载日记失败:', error)
      wx.hideLoading()
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },

  // 获取鸟类信息
  getBirdInfo(birdSpecies) {
    const birdKnowledge = {
      '珠颈斑鸠': '斑鸠的窝极其敷衍，有时只用三五根树枝',
      '夜鹭': '夜鹭是夜行性鸟类，白天主要负责"思考人生"',
      '银喉长尾山雀': '体重仅7-9克，比一枚硬币还轻',
      '苍鹭': '苍鹭为了等一条鱼可以静止好几个小时',
      '白鹡鸰': '走路永远一颠一颠，像在赶时间',
      '噪鹃': '叫声穿透力极强，能传1公里远',
      '乌鸫': '乌鸫能模仿超过50种声音',
      '红嘴蓝鹊': '会集体围攻老鹰，是鸟类界的"帮派老大"',
      '小䴙䴘': '遇到危险时不会飞，会瞬间潜入水中消失',
      '普通翠鸟': '俯冲入水捕鱼的时间仅需短短一两秒',
      '树麻雀': '最熟悉的城市鸟类，充满烟火气',
      '小白鹭': '繁殖期会长出极其飘逸的"饰羽"',
      '红隼': '城市中最常见的猛禽，会在空调外机上做窝',
      '喜鹊': '非常聪明，能够认出镜子里的自己',
      '家燕': '每年迁徙可飞行数万公里，却能精准回到旧巢'
    }

    return {
      name: birdSpecies,
      knowledge: birdKnowledge[birdSpecies] || '这是一只特别的鸟'
    }
  },

  // 删除日记
  deleteDiary() {
    wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复，确定要删除这条日记吗？',
      confirmText: '删除',
      confirmColor: '#FF5722',
      success: async (res) => {
        if (res.confirm) {
          await this.confirmDelete()
        }
      }
    })
  },

  // 确认删除
  async confirmDelete() {
    wx.showLoading({ title: '删除中...' })

    try {
      const db = wx.cloud.database()

      // 软删除：标记为已删除
      await db.collection('diaries')
        .doc(this.data.diaryId)
        .update({
          data: {
            isDeleted: true
          }
        })

      wx.hideLoading()
      wx.showToast({
        title: '已删除',
        icon: 'success'
      })

      // 返回上一页
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    } catch (error) {
      console.error('删除失败:', error)
      wx.hideLoading()
      wx.showToast({
        title: '删除失败',
        icon: 'none'
      })
    }
  },

  // 格式化时间
  formatTime(timestamp) {
    if (!timestamp) return ''

    const date = new Date(timestamp)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hour = String(date.getHours()).padStart(2, '0')
    const minute = String(date.getMinutes()).padStart(2, '0')

    return `${year}-${month}-${day} ${hour}:${minute}`
  }
})
