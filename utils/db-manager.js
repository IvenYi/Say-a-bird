// utils/db-manager.js
// 数据库操作封装

const db = wx.cloud.database()
const _ = db.command

/**
 * 数据库管理器
 */
class DBManager {

  // ========== 日记相关 ==========

  /**
   * 创建日记
   */
  async createDiary(data) {
    try {
      const res = await db.collection('diaries').add({
        data: {
          ...data,
          createTime: db.serverDate(),
          isDeleted: false
        }
      })
      return { success: true, id: res._id }
    } catch (error) {
      console.error('创建日记失败:', error)
      return { success: false, error }
    }
  }

  /**
   * 查询日记列表
   */
  async getDiaries(options = {}) {
    const {
      month = null,
      days = null,
      limit = 50
    } = options

    try {
      let query = db.collection('diaries').where({
        isDeleted: false
      })

      // 按月份筛选
      if (month) {
        query = query.where({ month })
      }

      // 按天数筛选
      if (days) {
        const daysAgo = new Date()
        daysAgo.setDate(daysAgo.getDate() - days)
        query = query.where({
          createTime: _.gte(daysAgo)
        })
      }

      const res = await query
        .orderBy('createTime', 'desc')
        .limit(limit)
        .get()

      return { success: true, data: res.data }
    } catch (error) {
      console.error('查询日记失败:', error)
      return { success: false, error }
    }
  }

  /**
   * 获取单条日记
   */
  async getDiary(id) {
    try {
      const res = await db.collection('diaries').doc(id).get()
      return { success: true, data: res.data }
    } catch (error) {
      console.error('获取日记失败:', error)
      return { success: false, error }
    }
  }

  /**
   * 删除日记（软删除）
   */
  async deleteDiary(id) {
    try {
      await db.collection('diaries').doc(id).update({
        data: {
          isDeleted: true
        }
      })
      return { success: true }
    } catch (error) {
      console.error('删除日记失败:', error)
      return { success: false, error }
    }
  }

  /**
   * 统计日记数量
   */
  async countDiaries(options = {}) {
    const { month = null } = options

    try {
      let query = db.collection('diaries').where({
        isDeleted: false
      })

      if (month) {
        query = query.where({ month })
      }

      const res = await query.count()
      return { success: true, count: res.total }
    } catch (error) {
      console.error('统计日记失败:', error)
      return { success: false, error }
    }
  }

  // ========== 图鉴相关 ==========

  /**
   * 检查鸟类是否已解锁
   */
  async checkBirdUnlocked(birdSpecies) {
    try {
      const res = await db.collection('gallery')
        .where({ birdSpecies })
        .count()

      return { success: true, unlocked: res.total > 0 }
    } catch (error) {
      console.error('检查解锁状态失败:', error)
      return { success: false, error }
    }
  }

  /**
   * 解锁新鸟类
   */
  async unlockBird(birdSpecies) {
    try {
      await db.collection('gallery').add({
        data: {
          birdSpecies,
          firstUnlockTime: db.serverDate(),
          unlockCount: 1
        }
      })
      return { success: true }
    } catch (error) {
      console.error('解锁鸟类失败:', error)
      return { success: false, error }
    }
  }

  /**
   * 增加鸟类出现次数
   */
  async incrementBirdCount(birdSpecies) {
    try {
      const res = await db.collection('gallery')
        .where({ birdSpecies })
        .get()

      if (res.data.length > 0) {
        await db.collection('gallery').doc(res.data[0]._id).update({
          data: {
            unlockCount: _.inc(1)
          }
        })
      }
      return { success: true }
    } catch (error) {
      console.error('更新鸟类计数失败:', error)
      return { success: false, error }
    }
  }

  /**
   * 获取图鉴列表
   */
  async getGallery() {
    try {
      const res = await db.collection('gallery')
        .orderBy('firstUnlockTime', 'asc')
        .get()

      return { success: true, data: res.data }
    } catch (error) {
      console.error('获取图鉴失败:', error)
      return { success: false, error }
    }
  }

  /**
   * 统计已解锁鸟类数量
   */
  async countUnlockedBirds() {
    try {
      const res = await db.collection('gallery').count()
      return { success: true, count: res.total }
    } catch (error) {
      console.error('统计解锁数量失败:', error)
      return { success: false, error }
    }
  }

  /**
   * 查询某鸟类的所有出现记录
   */
  async getBirdTimeline(birdSpecies) {
    try {
      const res = await db.collection('diaries')
        .where({
          birdSpecies,
          isDeleted: false
        })
        .orderBy('createTime', 'desc')
        .limit(50)
        .get()

      return { success: true, data: res.data }
    } catch (error) {
      console.error('查询鸟类时间线失败:', error)
      return { success: false, error }
    }
  }

  // ========== 用户相关 ==========

  /**
   * 创建或更新用户信息
   */
  async saveUserInfo(userInfo) {
    try {
      const res = await db.collection('users')
        .where({
          _openid: userInfo._openid
        })
        .get()

      if (res.data.length > 0) {
        // 更新
        await db.collection('users').doc(res.data[0]._id).update({
          data: {
            ...userInfo,
            lastLoginTime: db.serverDate()
          }
        })
      } else {
        // 创建
        await db.collection('users').add({
          data: {
            ...userInfo,
            createTime: db.serverDate(),
            lastLoginTime: db.serverDate()
          }
        })
      }
      return { success: true }
    } catch (error) {
      console.error('保存用户信息失败:', error)
      return { success: false, error }
    }
  }

  // ========== 月度迁徙相关 ==========

  /**
   * 设置守护鸟
   */
  async setGuardianBird(diaryId) {
    try {
      await db.collection('diaries').doc(diaryId).update({
        data: {
          isGuardian: true
        }
      })
      return { success: true }
    } catch (error) {
      console.error('设置守护鸟失败:', error)
      return { success: false, error }
    }
  }

  /**
   * 获取上月最后一只鸟
   */
  async getLastMonthLastBird(lastMonth) {
    try {
      const res = await db.collection('diaries')
        .where({
          month: lastMonth,
          isDeleted: false
        })
        .orderBy('createTime', 'desc')
        .limit(1)
        .get()

      return { success: true, data: res.data[0] || null }
    } catch (error) {
      console.error('获取上月最后一只鸟失败:', error)
      return { success: false, error }
    }
  }
}

module.exports = new DBManager()
