// utils/time-helper.js
// 时间处理工具

/**
 * 获取当前月份 YYYY-MM
 */
function getCurrentMonth() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

/**
 * 获取上个月份 YYYY-MM
 */
function getLastMonth() {
  const now = new Date()
  now.setMonth(now.getMonth() - 1)
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

/**
 * 获取当前时段
 * @returns {string} dawn|day|dusk|night
 */
function getCurrentTimeSlot() {
  const hour = new Date().getHours()
  if (hour >= 6 && hour < 8) return 'dawn'      // 清晨 06:00-08:00
  if (hour >= 8 && hour < 17) return 'day'      // 白天 08:00-17:00
  if (hour >= 17 && hour < 19) return 'dusk'    // 黄昏 17:00-19:00
  return 'night'                                 // 夜晚 19:00-06:00
}

/**
 * 获取时段对应的背景图
 */
function getBackgroundImage(timeSlot) {
  const backgrounds = {
    dawn: '/assets/images/bg-dawn.png',
    day: '/assets/images/bg-day.png',
    dusk: '/assets/images/bg-dusk.png',
    night: '/assets/images/bg-night.png'
  }
  return backgrounds[timeSlot] || backgrounds.day
}

/**
 * 格式化时间戳为 YYYY-MM-DD HH:mm
 */
function formatDateTime(timestamp) {
  if (!timestamp) return ''

  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day} ${hour}:${minute}`
}

/**
 * 格式化时间戳为 MM-DD
 */
function formatDate(timestamp) {
  if (!timestamp) return ''

  const date = new Date(timestamp)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${month}-${day}`
}

/**
 * 格式化时间戳为相对时间
 */
function formatRelativeTime(timestamp) {
  if (!timestamp) return ''

  const now = new Date()
  const date = new Date(timestamp)
  const diff = now - date

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}天前`
  if (hours > 0) return `${hours}小时前`
  if (minutes > 0) return `${minutes}分钟前`
  return '刚刚'
}

/**
 * 检查是否是今天
 */
function isToday(timestamp) {
  if (!timestamp) return false

  const date = new Date(timestamp)
  const today = new Date()

  return date.getFullYear() === today.getFullYear() &&
         date.getMonth() === today.getMonth() &&
         date.getDate() === today.getDate()
}

/**
 * 检查是否是本月
 */
function isThisMonth(timestamp) {
  if (!timestamp) return false

  const date = new Date(timestamp)
  const today = new Date()

  return date.getFullYear() === today.getFullYear() &&
         date.getMonth() === today.getMonth()
}

/**
 * 获取N天前的日期
 */
function getDaysAgo(days) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

module.exports = {
  getCurrentMonth,
  getLastMonth,
  getCurrentTimeSlot,
  getBackgroundImage,
  formatDateTime,
  formatDate,
  formatRelativeTime,
  isToday,
  isThisMonth,
  getDaysAgo
}
