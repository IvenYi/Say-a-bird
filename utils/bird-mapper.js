// utils/bird-mapper.js
// 鸟类映射引擎

const { BIRD_CONFIG, EMOTION_TO_BIRD, ECOLOGY_LAYER_RANGES } = require('./bird-config.js')

/**
 * 根据情绪类型映射到鸟类品种
 */
function mapEmotionToBird(emotionType) {
  return EMOTION_TO_BIRD[emotionType] || '树麻雀' // 默认返回树麻雀
}

/**
 * 获取鸟类配置信息
 */
function getBirdConfig(birdSpecies) {
  return BIRD_CONFIG[birdSpecies] || null
}

/**
 * 获取鸟类生态位
 */
function getEcologyLayer(birdSpecies) {
  const config = BIRD_CONFIG[birdSpecies]
  return config ? config.ecologyLayer : '中低空'
}

/**
 * 获取鸟类知识
 */
function getBirdKnowledge(birdSpecies) {
  const config = BIRD_CONFIG[birdSpecies]
  return config ? config.knowledge : '这是一只特别的鸟'
}

/**
 * 根据姿势获取鸟类图片URL
 */
function getBirdImageUrl(birdSpecies, posture) {
  const config = BIRD_CONFIG[birdSpecies]
  if (!config) return '/assets/images/birds/placeholder.png'

  // 如果指定姿势存在，返回对应图片
  if (config.postures[posture]) {
    return config.postures[posture]
  }

  // 否则返回第一个姿势的图片
  const firstPosture = Object.keys(config.postures)[0]
  return config.postures[firstPosture] || '/assets/images/birds/placeholder.png'
}

/**
 * 根据生态位获取随机Y坐标
 */
function getRandomPositionY(ecologyLayer) {
  const range = ECOLOGY_LAYER_RANGES[ecologyLayer] || [30, 60]
  const [min, max] = range
  return Math.random() * (max - min) + min
}

/**
 * 获取随机X坐标（10%-90%）
 */
function getRandomPositionX() {
  return Math.random() * 80 + 10
}

/**
 * 获取所有鸟类列表
 */
function getAllBirds() {
  return Object.keys(BIRD_CONFIG).map(name => ({
    name,
    ...BIRD_CONFIG[name]
  }))
}

/**
 * 根据情绪强度和类型决定姿势
 */
function decidePosture(emotionType, intensity) {
  // 强度 4-5 为强情绪
  if (intensity >= 4) {
    // 负面情绪用缩头
    const negativeEmotions = ['疲惫', '委屈', '深夜emo', '社恐', '灵魂出窍', '冤种', '有苦说不出', '孤独', '逃避']
    if (negativeEmotions.includes(emotionType)) {
      return '缩头'
    }
    // 正面情绪用展翅
    return '展翅'
  }

  // 强度 1-3 用栖息
  return '栖息'
}

/**
 * 完整的情绪到鸟类映射流程
 */
function mapEmotionToFullBirdData(emotionResult) {
  const { emotion_type, intensity, posture, keywords } = emotionResult

  // 1. 映射到鸟类品种
  const birdSpecies = mapEmotionToBird(emotion_type)

  // 2. 获取生态位
  const ecologyLayer = getEcologyLayer(birdSpecies)

  // 3. 决定姿势（如果LLM返回的姿势不合适，可以重新决定）
  const finalPosture = posture || decidePosture(emotion_type, intensity)

  // 4. 获取图片URL
  const birdImageUrl = getBirdImageUrl(birdSpecies, finalPosture)

  // 5. 获取位置
  const positionX = getRandomPositionX()
  const positionY = getRandomPositionY(ecologyLayer)

  return {
    birdSpecies,
    ecologyLayer,
    posture: finalPosture,
    birdImageUrl,
    positionX,
    positionY,
    emotionType: emotion_type,
    intensity,
    keywords
  }
}

module.exports = {
  mapEmotionToBird,
  getBirdConfig,
  getEcologyLayer,
  getBirdKnowledge,
  getBirdImageUrl,
  getRandomPositionY,
  getRandomPositionX,
  getAllBirds,
  decidePosture,
  mapEmotionToFullBirdData
}
