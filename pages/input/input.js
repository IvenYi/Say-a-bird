// pages/input/input.js
Page({
  data: {
    content: '',
    isRecording: false,
    longPressTimer: null,
    showLongPressHint: false
  },

  onLoad() {
    // 显示长按提示
    setTimeout(() => {
      this.setData({ showLongPressHint: true })
    }, 1000)
  },

  // 文本输入
  onInput(e) {
    this.setData({
      content: e.detail.value
    })
  },

  // 开始语音输入
  startVoiceInput() {
    const recorderManager = wx.getRecorderManager()

    recorderManager.onStart(() => {
      this.setData({ isRecording: true })
      wx.showToast({
        title: '正在录音...',
        icon: 'none',
        duration: 10000
      })
    })

    recorderManager.onStop((res) => {
      this.setData({ isRecording: false })
      wx.hideToast()

      // 调用语音识别
      this.recognizeVoice(res.tempFilePath)
    })

    recorderManager.start({
      duration: 60000,
      format: 'mp3'
    })
  },

  // 停止语音输入
  stopVoiceInput() {
    const recorderManager = wx.getRecorderManager()
    recorderManager.stop()
  },

  // 语音识别
  async recognizeVoice(filePath) {
    wx.showLoading({ title: '识别中...' })

    try {
      // 调用微信语音识别插件
      const plugin = requirePlugin('WechatSI')
      const manager = plugin.getRecordRecognitionManager()

      manager.onRecognize = (res) => {
        this.setData({
          content: this.data.content + res.result
        })
      }

      wx.hideLoading()
    } catch (error) {
      console.error('语音识别失败:', error)
      wx.hideLoading()
      wx.showToast({
        title: '识别失败，请重试',
        icon: 'none'
      })
    }
  },

  // 长按开始（一键放空）
  onLongPressStart() {
    this.data.longPressTimer = setTimeout(() => {
      wx.vibrateShort()
      this.handleEmptyInput()
    }, 1000)
  },

  // 长按结束
  onLongPressEnd() {
    if (this.data.longPressTimer) {
      clearTimeout(this.data.longPressTimer)
      this.data.longPressTimer = null
    }
  },

  // 处理一键放空
  async handleEmptyInput() {
    wx.showLoading({ title: '记录放空状态...' })

    try {
      // 调用情绪分析云函数（空内容）
      const res = await wx.cloud.callFunction({
        name: 'analyzeEmotion',
        data: { content: '' }
      })

      const emotionResult = res.result

      // 保存到数据库
      await this.saveDiary('', emotionResult)

      wx.hideLoading()
      wx.showToast({
        title: '已记录放空状态',
        icon: 'success'
      })

      // 延迟返回
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    } catch (error) {
      console.error('记录失败:', error)
      wx.hideLoading()
      wx.showToast({
        title: '记录失败',
        icon: 'none'
      })
    }
  },

  // 提交情绪
  async submitEmotion() {
    const content = this.data.content.trim()

    if (!content) {
      wx.showToast({
        title: '请输入内容或长按放空',
        icon: 'none'
      })
      return
    }

    if (content.length > 500) {
      wx.showToast({
        title: '内容不能超过500字',
        icon: 'none'
      })
      return
    }

    wx.showLoading({ title: '分析中...' })

    try {
      // 调用情绪分析云函数
      const res = await wx.cloud.callFunction({
        name: 'analyzeEmotion',
        data: { content }
      })

      const emotionResult = res.result

      // 显示情绪预览，让用户确认
      this.showEmotionPreview(content, emotionResult)

      wx.hideLoading()
    } catch (error) {
      console.error('情绪分析失败:', error)
      wx.hideLoading()
      wx.showToast({
        title: '分析失败，请重试',
        icon: 'none'
      })
    }
  },

  // 显示情绪预览
  showEmotionPreview(content, emotionResult) {
    wx.showModal({
      title: '确认情绪',
      content: `识别到的情绪：${emotionResult.emotion_type}\n强度：${emotionResult.intensity}/5\n姿势：${emotionResult.posture}`,
      confirmText: '确认',
      cancelText: '调整',
      success: async (res) => {
        if (res.confirm) {
          // 确认，保存日记
          await this.saveDiary(content, emotionResult)
        } else {
          // 取消，允许手动调整
          this.showEmotionAdjust(content, emotionResult)
        }
      }
    })
  },

  // 显示情绪调整界面
  showEmotionAdjust(content, emotionResult) {
    // TODO: 实现情绪手动调整界面
    wx.showToast({
      title: '手动调整功能开发中',
      icon: 'none'
    })
  },

  // 保存日记
  async saveDiary(content, emotionResult) {
    wx.showLoading({ title: '保存中...' })

    try {
      const db = wx.cloud.database()

      // 检查是否首次解锁该鸟类
      const birdSpecies = this.mapEmotionToBird(emotionResult.emotion_type)
      const isFirstUnlock = await this.checkFirstUnlock(birdSpecies)

      // 获取生态位
      const ecologyLayer = this.getEcologyLayer(birdSpecies)

      // 保存日记
      const diaryRes = await db.collection('diaries').add({
        data: {
          content: content,
          emotionType: emotionResult.emotion_type,
          intensity: emotionResult.intensity,
          posture: emotionResult.posture,
          keywords: emotionResult.keywords,
          birdSpecies: birdSpecies,
          ecologyLayer: ecologyLayer,
          isFirstUnlock: isFirstUnlock,
          createTime: db.serverDate(),
          month: this.getCurrentMonth(),
          isGuardian: false,
          isDeleted: false,
          positionX: Math.random() * 80 + 10, // 随机位置 10-90%
          positionY: this.getRandomPositionY(ecologyLayer)
        }
      })

      // 如果是首次解锁，更新图鉴
      if (isFirstUnlock) {
        await db.collection('gallery').add({
          data: {
            birdSpecies: birdSpecies,
            firstUnlockTime: db.serverDate(),
            unlockCount: 1
          }
        })

        // 显示解锁特效
        wx.showToast({
          title: `🎉 解锁新鸟类：${birdSpecies}`,
          icon: 'none',
          duration: 2000
        })
      }

      wx.hideLoading()

      // 返回天空页
      setTimeout(() => {
        wx.navigateBack()
      }, isFirstUnlock ? 2000 : 1000)
    } catch (error) {
      console.error('保存失败:', error)
      wx.hideLoading()
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      })
    }
  },

  // 检查是否首次解锁
  async checkFirstUnlock(birdSpecies) {
    try {
      const db = wx.cloud.database()
      const res = await db.collection('gallery')
        .where({
          birdSpecies: birdSpecies
        })
        .count()

      return res.total === 0
    } catch (error) {
      console.error('检查解锁状态失败:', error)
      return false
    }
  },

  // 情绪映射到鸟类品种
  mapEmotionToBird(emotionType) {
    const emotionBirdMap = {
      '敷衍': '珠颈斑鸠',
      '佛系': '珠颈斑鸠',
      '下班状态': '夜鹭',
      '疲惫': '夜鹭',
      '极致治愈': '银喉长尾山雀',
      '温暖': '银喉长尾山雀',
      '极致摸鱼': '苍鹭',
      '忙碌': '白鹡鸰',
      '委屈': '噪鹃',
      '深夜emo': '乌鸫',
      '愤怒': '红嘴蓝鹊',
      '社恐': '小䴙䴘',
      '专注': '普通翠鸟',
      '平静': '树麻雀',
      '优雅': '小白鹭',
      '释然': '小白鹭',
      '搞钱': '红隼',
      '小确幸': '喜鹊',
      '八卦': '喜鹊',
      '归属': '家燕',
      '乡愁': '家燕'
    }

    return emotionBirdMap[emotionType] || '树麻雀'
  },

  // 获取生态位
  getEcologyLayer(birdSpecies) {
    const ecologyMap = {
      '珠颈斑鸠': '中低空',
      '夜鹭': '中低空',
      '银喉长尾山雀': '中低空',
      '苍鹭': '近地面',
      '白鹡鸰': '近地面',
      '噪鹃': '中低空',
      '乌鸫': '近地面',
      '红嘴蓝鹊': '近地面',
      '小䴙䴘': '水面',
      '普通翠鸟': '中低空',
      '树麻雀': '近地面',
      '小白鹭': '高空',
      '红隼': '高空',
      '喜鹊': '中低空',
      '家燕': '高空'
    }

    return ecologyMap[birdSpecies] || '中低空'
  },

  // 根据生态位获取随机Y坐标
  getRandomPositionY(ecologyLayer) {
    const ranges = {
      '高空': [5, 25],
      '中低空': [30, 60],
      '近地面': [65, 80],
      '水面': [82, 88]
    }

    const [min, max] = ranges[ecologyLayer] || [30, 60]
    return Math.random() * (max - min) + min
  },

  // 获取当前月份
  getCurrentMonth() {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    return `${year}-${month}`
  }
})
