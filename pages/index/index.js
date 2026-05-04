Page({
  data: {
    result: null
  },

  // 测试云函数调用
  async testCloudFunction() {
    wx.showLoading({ title: '调用中...' })
    try {
      const res = await wx.cloud.callFunction({
        name: 'analyzeEmotion',
        data: {
          content: '老板真的恶心，所有事情都拍脑袋决定，操了真的'
        }
      })
      console.log('云函数返回：', res.result)
      this.setData({ result: res.result })
    } catch (e) {
      console.error('云函数调用失败：', e)
      wx.showToast({ title: '调用失败', icon: 'error' })
    } finally {
      wx.hideLoading()
    }
  }
})