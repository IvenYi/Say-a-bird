// utils/bird-config.js
// 15种MVP鸟类配置

const BIRD_CONFIG = {
  '珠颈斑鸠': {
    emotions: ['敷衍', '佛系', '随便'],
    ecologyLayer: '中低空',
    knowledge: '斑鸠的窝极其敷衍，有时只用三五根树枝',
    postures: {
      '栖息': '/assets/images/birds/zhujingbanjiu_rest.png',
      '展翅': '/assets/images/birds/zhujingbanjiu_fly.png'
    }
  },
  '夜鹭': {
    emotions: ['下班状态', '疲惫', '灵魂出窍'],
    ecologyLayer: '中低空',
    knowledge: '夜鹭是夜行性鸟类，白天主要负责"思考人生"',
    postures: {
      '栖息': '/assets/images/birds/yelu_rest.png',
      '缩头': '/assets/images/birds/yelu_tired.png'
    }
  },
  '银喉长尾山雀': {
    emotions: ['极致治愈', '温暖', '软萌'],
    ecologyLayer: '中低空',
    knowledge: '体重仅7-9克，比一枚硬币还轻',
    postures: {
      '栖息': '/assets/images/birds/yinhoumaque_rest.png',
      '展翅': '/assets/images/birds/yinhoumaque_fly.png'
    }
  },
  '苍鹭': {
    emotions: ['极致摸鱼', '躺平', '等待'],
    ecologyLayer: '近地面',
    knowledge: '苍鹭为了等一条鱼可以静止好几个小时',
    postures: {
      '栖息': '/assets/images/birds/canglu_rest.png',
      '展翅': '/assets/images/birds/canglu_fly.png'
    }
  },
  '白鹡鸰': {
    emotions: ['忙碌', '瞎忙', '奔波'],
    ecologyLayer: '近地面',
    knowledge: '走路永远一颠一颠，像在赶时间',
    postures: {
      '栖息': '/assets/images/birds/baijiling_rest.png',
      '展翅': '/assets/images/birds/baijiling_fly.png'
    }
  },
  '噪鹃': {
    emotions: ['委屈', '冤种', '有苦说不出'],
    ecologyLayer: '中低空',
    knowledge: '叫声穿透力极强，能传1公里远',
    postures: {
      '栖息': '/assets/images/birds/zaojuan_rest.png',
      '缩头': '/assets/images/birds/zaojuan_sad.png'
    }
  },
  '乌鸫': {
    emotions: ['深夜emo', '沉思', '孤独'],
    ecologyLayer: '近地面',
    knowledge: '乌鸫能模仿超过50种声音',
    postures: {
      '栖息': '/assets/images/birds/wudong_rest.png',
      '缩头': '/assets/images/birds/wudong_emo.png'
    }
  },
  '红嘴蓝鹊': {
    emotions: ['愤怒', '反击', '不好惹'],
    ecologyLayer: '近地面',
    knowledge: '会集体围攻老鹰，是鸟类界的"帮派老大"',
    postures: {
      '栖息': '/assets/images/birds/hongzuilanque_rest.png',
      '展翅': '/assets/images/birds/hongzuilanque_angry.png'
    }
  },
  '小䴙䴘': {
    emotions: ['社恐', '躲猫猫', '逃避'],
    ecologyLayer: '水面',
    knowledge: '遇到危险时不会飞，会瞬间潜入水中消失',
    postures: {
      '栖息': '/assets/images/birds/xiaopiti_rest.png',
      '缩头': '/assets/images/birds/xiaopiti_hide.png'
    }
  },
  '普通翠鸟': {
    emotions: ['专注', '灵光一现', '精准'],
    ecologyLayer: '中低空',
    knowledge: '俯冲入水捕鱼的时间仅需短短一两秒',
    postures: {
      '栖息': '/assets/images/birds/putongcuiniao_rest.png',
      '展翅': '/assets/images/birds/putongcuiniao_focus.png'
    }
  },
  '树麻雀': {
    emotions: ['平静', '琐碎日常', '烟火气'],
    ecologyLayer: '近地面',
    knowledge: '最熟悉的城市鸟类，充满烟火气',
    postures: {
      '栖息': '/assets/images/birds/shumaque_rest.png',
      '展翅': '/assets/images/birds/shumaque_fly.png'
    }
  },
  '小白鹭': {
    emotions: ['优雅', '释然', '放下'],
    ecologyLayer: '高空',
    knowledge: '繁殖期会长出极其飘逸的"饰羽"',
    postures: {
      '栖息': '/assets/images/birds/xiaobailu_rest.png',
      '展翅': '/assets/images/birds/xiaobailu_elegant.png'
    }
  },
  '红隼': {
    emotions: ['专注', '搞钱', '盯紧目标'],
    ecologyLayer: '高空',
    knowledge: '城市中最常见的猛禽，会在空调外机上做窝',
    postures: {
      '栖息': '/assets/images/birds/hongsun_rest.png',
      '展翅': '/assets/images/birds/hongsun_hunt.png'
    }
  },
  '喜鹊': {
    emotions: ['小确幸', '八卦', '热闹'],
    ecologyLayer: '中低空',
    knowledge: '非常聪明，能够认出镜子里的自己',
    postures: {
      '栖息': '/assets/images/birds/xique_rest.png',
      '展翅': '/assets/images/birds/xique_happy.png'
    }
  },
  '家燕': {
    emotions: ['归属', '念旧', '乡愁'],
    ecologyLayer: '高空',
    knowledge: '每年迁徙可飞行数万公里，却能精准回到旧巢',
    postures: {
      '栖息': '/assets/images/birds/jiayan_rest.png',
      '展翅': '/assets/images/birds/jiayan_fly.png'
    }
  }
}

// 情绪到鸟类的映射
const EMOTION_TO_BIRD = {
  '敷衍': '珠颈斑鸠',
  '佛系': '珠颈斑鸠',
  '随便': '珠颈斑鸠',
  '下班状态': '夜鹭',
  '疲惫': '夜鹭',
  '灵魂出窍': '夜鹭',
  '极致治愈': '银喉长尾山雀',
  '温暖': '银喉长尾山雀',
  '软萌': '银喉长尾山雀',
  '极致摸鱼': '苍鹭',
  '躺平': '苍鹭',
  '等待': '苍鹭',
  '忙碌': '白鹡鸰',
  '瞎忙': '白鹡鸰',
  '奔波': '白鹡鸰',
  '委屈': '噪鹃',
  '冤种': '噪鹃',
  '有苦说不出': '噪鹃',
  '深夜emo': '乌鸫',
  '沉思': '乌鸫',
  '孤独': '乌鸫',
  '愤怒': '红嘴蓝鹊',
  '反击': '红嘴蓝鹊',
  '不好惹': '红嘴蓝鹊',
  '社恐': '小䴙䴘',
  '躲猫猫': '小䴙䴘',
  '逃避': '小䴙䴘',
  '专注': '普通翠鸟',
  '灵光一现': '普通翠鸟',
  '精准': '普通翠鸟',
  '平静': '树麻雀',
  '琐碎日常': '树麻雀',
  '烟火气': '树麻雀',
  '优雅': '小白鹭',
  '释然': '小白鹭',
  '放下': '小白鹭',
  '搞钱': '红隼',
  '盯紧目标': '红隼',
  '小确幸': '喜鹊',
  '八卦': '喜鹊',
  '热闹': '喜鹊',
  '归属': '家燕',
  '念旧': '家燕',
  '乡愁': '家燕'
}

// 生态位Y坐标范围
const ECOLOGY_LAYER_RANGES = {
  '高空': [5, 25],
  '中低空': [30, 60],
  '近地面': [65, 80],
  '水面': [82, 88]
}

module.exports = {
  BIRD_CONFIG,
  EMOTION_TO_BIRD,
  ECOLOGY_LAYER_RANGES
}
