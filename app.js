App({
  onLaunch() {
    console.log('小程序启动成功')
    
    // 👇 必须加这一行！初始化云开发环境
    wx.cloud.init({
      env: 'cloud1-d4gxofamt1a20748c', // 这里要换成你自己的环境ID
      traceUser: true
    })
  }
})