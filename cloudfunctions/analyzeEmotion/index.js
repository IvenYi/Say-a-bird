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
  "干饭": { emotion_type: "干饭快乐", intensity: 4, posture: "栖息", keywords: ["干饭", "好吃"] },
  "平静": { emotion_type: "平静", intensity: 3, posture: "栖息", keywords: ["平静", "放松"] }
};

// 系统Prompt（更严格，绝对不要加任何多余文字）
const SYSTEM_PROMPT = `你是一个情绪分析机器人，只输出严格的JSON格式，不要任何其他文字、解释、说明、markdown或代码块。
输出必须包含且仅包含以下字段：
- emotion_type: 核心情绪，只能从以下列表中选择：敷衍/下班状态/极致治愈/温暖/极致摸鱼/忙碌/碎碎念/委屈/深夜emo/划水/愤怒/奶凶/干饭快乐/悠闲/熬夜/社恐/小确幸/特立独行/专注/平静/兴奋/精致悠闲/优雅/恋爱/旅行快乐/八卦/撑腰/吐槽/幸运/元气/归属/微醺/精力旺盛/精致/可爱/震惊
- intensity: 情绪强度，1-5的整数
- posture: 姿势，只能是"栖息"、"展翅"或"缩头"。正向情绪用展翅，负向情绪用缩头，中性情绪用栖息
- keywords: 2个不暴露隐私的中性关键词，每个不超过4个字

示例输出：
{"emotion_type":"极致摸鱼","intensity":4,"posture":"栖息","keywords":["摸鱼","爽"]}

现在分析以下用户的日记：`;

// 从任意文本中提取JSON的工具函数
function extractJson(text) {
  try {
    // 先尝试直接解析
    return JSON.parse(text);
  } catch (e) {
    // 提取第一个{和最后一个}之间的内容
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      const jsonStr = text.substring(start, end + 1);
      try {
        return JSON.parse(jsonStr);
      } catch (e2) {
        console.error('JSON提取失败:', jsonStr);
        return null;
      }
    }
    return null;
  }
}

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
    console.log('调用DeepSeek V4，输入内容:', content);
    
    const response = await axios.post('https://api.deepseek.com/chat/completions', {
      model: 'deepseek-v4-flash',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: content }
      ],
      temperature: 0.1, // 越低越稳定，不要改
      max_tokens: 200 // 限制输出长度，省钱
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000 // 延长超时时间到10秒
    });

    const rawContent = response.data.choices[0].message.content;
    console.log('DeepSeek返回原始内容:', rawContent);
    
    const result = extractJson(rawContent);
    
    // 验证返回结果是否合法
    if (result && result.emotion_type && result.intensity && result.posture && result.keywords) {
      console.log('解析成功:', result);
      return result;
    }
    throw new Error('返回结果不合法');
  } catch (e) {
    console.log('DeepSeek V4调用失败:', e.message);
    
    // 3. DeepSeek失败，尝试调用Kimi（备用）
    try {
      console.log('切换到Kimi');
      
      const response = await axios.post('https://api.moonshot.cn/v1/chat/completions', {
        model: 'moonshot-v1-8k',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: content }
        ],
        temperature: 0.1,
        max_tokens: 200
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.KIMI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      const rawContent = response.data.choices[0].message.content;
      console.log('Kimi返回原始内容:', rawContent);
      
      const result = extractJson(rawContent);
      
      if (result && result.emotion_type && result.intensity && result.posture && result.keywords) {
        console.log('Kimi解析成功:', result);
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