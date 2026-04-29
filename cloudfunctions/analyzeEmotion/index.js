const axios = require('axios');

// 本地兜底映射表（LLM完全挂掉时使用）
const FALLBACK_MAP = {
  "开心": { emotion_type: "极致治愈", intensity: 4, posture: "展翅", keywords: ["开心", "快乐"] },
  "疲惫": { emotion_type: "下班状态", intensity: 5, posture: "缩头", keywords: ["疲惫", "下班"] },
  "摸鱼": { emotion_type: "极致摸鱼", intensity: 4, posture: "栖息", keywords: ["摸鱼", "躺平"] },
  "委屈": { emotion_type: "委屈", intensity: 5, posture: "缩头", keywords: ["委屈", "难过"] },
  "愤怒": { emotion_type: "愤怒", intensity: 5, posture: "展翅", keywords: ["生气", "愤怒"] },
  "无聊": { emotion_type: "敷衍", intensity: 3, posture: "栖息", keywords: ["无聊", "随便"] },
  "焦虑": { emotion_type: "专注", intensity: 4, posture: "展翅", keywords: ["焦虑", "忙碌"] },
  "治愈": { emotion_type: "温暖", intensity: 4, posture: "栖息", keywords: ["治愈", "温暖"] },
  "社恐": { emotion_type: "社恐", intensity: 4, posture: "缩头", keywords: ["社恐", "害怕"] },
  "干饭": { emotion_type: "干饭快乐", intensity: 4, posture: "栖息", keywords: ["干饭", "好吃"] }
};

// 系统Prompt（严格约束JSON输出）
const SYSTEM_PROMPT = `你是一个心理分析师，阅读以下用户的日记，只输出严格的JSON格式，不要任何其他文字、解释或说明。
输出必须包含且仅包含以下字段：
- emotion_type: 核心情绪，只能从以下列表中选择：敷衍/下班状态/极致治愈/温暖/极致摸鱼/忙碌/碎碎念/委屈/深夜emo/划水/愤怒/奶凶/干饭快乐/悠闲/熬夜/社恐/小确幸/特立独行/专注/平静/兴奋/精致悠闲/优雅/恋爱/旅行快乐/八卦/撑腰/吐槽/幸运/元气/归属/微醺/精力旺盛/精致/可爱/震惊
- intensity: 情绪强度，1-5的整数
- posture: 姿势，只能是"栖息"、"展翅"或"缩头"。正向情绪用展翅，负向情绪用缩头，中性情绪用栖息
- keywords: 2个不暴露隐私的中性关键词，每个不超过4个字

日记内容：`;

exports.main = async (event, context) => {
  const { content } = event;
  
  // 1. 先检查输入是否为空（一键放空）
  if (!content || content.trim() === '') {
    return {
      emotion_type: "下班状态",
      intensity: 3,
      posture: "缩头",
      keywords: ["放空", "休息"]
    };
  }

  // 2. 先尝试调用DeepSeek V4-Flash（主力）
  try {
    const response = await axios.post('https://api.deepseek.com/chat/completions', {
      model: 'deepseek-v4-flash', // 👈 这里改成了V4-Flash
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: content }
      ],
      temperature: 0.1, // 越低越稳定，不要改
      response_format: { type: 'json_object' },
      max_tokens: 200 // 限制输出长度，省钱
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 5000 // 5秒超时
    });

    const result = JSON.parse(response.data.choices[0].message.content);
    // 验证返回结果是否合法
    if (result.emotion_type && result.intensity && result.posture && result.keywords) {
      return result;
    }
    throw new Error('返回结果不合法');
  } catch (e) {
    console.log('DeepSeek V4调用失败:', e.message);
    
    // 3. DeepSeek失败，尝试调用Kimi（备用）
    try {
      const response = await axios.post('https://api.moonshot.cn/v1/chat/completions', {
        model: 'moonshot-v1-8k',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: content }
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' },
        max_tokens: 200
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.KIMI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      });

      const result = JSON.parse(response.data.choices[0].message.content);
      if (result.emotion_type && result.intensity && result.posture && result.keywords) {
        return result;
      }
      throw new Error('Kimi返回结果不合法');
    } catch (e2) {
      console.log('Kimi调用失败:', e2.message);
      
      // 4. 两个都失败，使用本地兜底
      console.log('使用本地兜底');
      // 简单匹配关键词
      for (const [key, value] of Object.entries(FALLBACK_MAP)) {
        if (content.includes(key)) {
          return value;
        }
      }
      // 都匹配不到，返回默认
      return FALLBACK_MAP["平静"];
    }
  }
};