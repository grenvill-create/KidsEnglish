// 语音引擎：支持英语自然语音、中文语音以及百度真人发音（拼音发声）
let voices = []
let currentPinyinAudio = null

function initVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  voices = window.speechSynthesis.getVoices()
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices()
    }
  }
}

initVoices()

// 停止所有正在发声的语音（包括百度真人音频和系统TTS）
export function stopSpeech() {
  if (currentPinyinAudio) {
    try {
      currentPinyinAudio.pause()
      currentPinyinAudio.currentTime = 0
    } catch (e) {
      // 忽略已卸载异常
    }
    currentPinyinAudio = null
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}

// 汉语拼音发音标准对照表（幼儿园/小学标准教材发声规范）
export const PINYIN_PHONETIC_MAP = {
  // 23 个声母标准读音（如 b 读 玻，p 读 坡，m 读 摸，f 读 佛）
  'b': '玻',
  'p': '坡',
  'm': '摸',
  'f': '佛',
  'd': '得',
  't': '特',
  'n': '讷',
  'l': '勒',
  'g': '哥',
  'k': '科',
  'h': '喝',
  'j': '基',
  'q': '欺',
  'x': '希',
  'zh': '知',
  'ch': '吃',
  'sh': '诗',
  'r': '日',
  'z': '资',
  'c': '疵',
  's': '思',
  'y': '衣',
  'w': '乌',

  // 单韵母及带声调发音
  'a': '啊', 'ā': '啊', 'á': '啊', 'ǎ': '啊', 'à': '啊',
  'o': '喔', 'ō': '喔', 'ó': '喔', 'ǒ': '喔', 'ò': '喔',
  'e': '婀', 'ē': '婀', 'é': '鹅', 'ě': '恶', 'è': '饿',
  'i': '衣', 'ī': '衣', 'í': '姨', 'ǐ': '椅', 'ì': '意',
  'u': '乌', 'ū': '乌', 'ú': '无', 'ǔ': '五', 'ù': '雾',
  'ü': '迂', 'ǖ': '迂', 'ǘ': '鱼', 'ǚ': '雨', 'ǜ': '玉',
  'v': '迂',

  // 复韵母与鼻韵母
  'ai': '哀', 'āi': '哀', 'ái': '癌', 'ǎi': '矮', 'ài': '爱',
  'ei': '欸', 'ēi': '欸', 'éi': '欸', 'ěi': '欸', 'èi': '妹',
  'ui': '微', 'uī': '威', 'uí': '韦', 'uǐ': '伟', 'uì': '对',
  'ao': '熬', 'āo': '熬', 'áo': '熬', 'ǎo': '袄', 'ào': '傲',
  'ou': '欧', 'ōu': '欧', 'óu': '欧', 'ǒu': '偶', 'òu': '藕',
  'iu': '优', 'iū': '优', 'iú': '油', 'iǔ': '有', 'iù': '右',
  'ie': '椰', 'iē': '椰', 'ié': '爷', 'iě': '野', 'iè': '叶',
  'üe': '约', 'üē': '约', 'üé': '月', 'üě': '月', 'üè': '月',
  'er': '儿', 'ēr': '儿', 'ér': '儿', 'ěr': '耳', 'èr': '二',
  'an': '安', 'ān': '安', 'án': '鞍', 'ǎn': '按', 'àn': '按',
  'en': '恩', 'ēn': '恩', 'én': '恩', 'ěn': '恩', 'èn': '摁',
  'in': '因', 'īn': '因', 'ín': '银', 'ǐn': '引', 'ìn': '印',
  'un': '温', 'ūn': '温', 'ún': '文', 'ǔn': '稳', 'ùn': '问',
  'ün': '晕', 'ǖn': '晕', 'ǘn': '云', 'ǚn': '允', 'ǜn': '运',
  'ang': '昂', 'āng': '昂', 'áng': '昂', 'ǎng': '仰', 'àng': '浪',
  'eng': '鞥', 'ēng': '亨', 'éng': '恒', 'ěng': '狠', 'èng': '更',
  'ing': '英', 'īng': '英', 'íng': '迎', 'ǐng': '影', 'ìng': '硬',
  'ong': '轰', 'ōng': '轰', 'óng': '红', 'ǒng': '拱', 'òng': '共',

  // 常见拼读音节
  'bā': '八', 'bá': '拔', 'bǎ': '把', 'bà': '爸', 'ba': '八',
  'pā': '趴', 'pá': '爬', 'pǎ': '扒', 'pà': '怕', 'pa': '爬',
  'mā': '妈', 'má': '麻', 'mǎ': '马', 'mà': '骂', 'ma': '妈',
  'fā': '发', 'fá': '罚', 'fǎ': '法', 'fà': '理发', 'fa': '发',
  'bō': '波', 'pō': '坡', 'mō': '摸', 'fó': '佛', 'bo': '波', 'po': '坡', 'mo': '摸', 'fo': '佛',
  'dā': '搭', 'dá': '达', 'dǎ': '打', 'dà': '大', 'da': '大',
  'tā': '他', 'tá': '塔', 'tǎ': '塔', 'tà': '踏', 'ta': '他',
  'nā': '拿', 'ná': '拿', 'nǎ': '哪', 'nà': '那', 'na': '那',
  'lā': '拉', 'lá': '拉', 'lǎ': '喇', 'là': '辣', 'la': '拉'
}

/**
 * 将拼音字母或拼读组合转换成标准发音汉字（如 b 转换成 玻）
 */
export function getPinyinPhoneticText(text) {
  if (!text) return ''
  // 移除常见 emoji
  const cleaned = text.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim()
  
  // 单个声母或韵母直接精确匹配
  const lower = cleaned.toLowerCase()
  if (PINYIN_PHONETIC_MAP[lower]) return PINYIN_PHONETIC_MAP[lower]
  if (PINYIN_PHONETIC_MAP[cleaned]) return PINYIN_PHONETIC_MAP[cleaned]

  // 多词/复合句按拼音单词替换
  return cleaned.replace(/[a-zA-Zāáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜ]+/g, (match) => {
    return PINYIN_PHONETIC_MAP[match] || PINYIN_PHONETIC_MAP[match.toLowerCase()] || match
  })
}

/**
 * 百度真人发音：用于汉语拼音字母认读与声韵拼读
 * @param {string} text 拼音字母（如 'b', 'p', 'bā'）或拼读流程语句
 * @param {boolean} isSlow 是否为慢速模式（儿童跟读模式）
 * @param {Function|null} onEnd 播放结束回调
 */
export function speakPinyinBaidu(text, isSlow = false, onEnd = null) {
  stopSpeech()

  const phoneticText = getPinyinPhoneticText(text)
  // 慢速 3，正常幼教语速 4
  const spd = isSlow ? 3 : 4
  const url = `https://fanyi.baidu.com/gettts?lan=zh&text=${encodeURIComponent(phoneticText)}&spd=${spd}&source=web`

  try {
    const audio = new Audio()
    // 设置不发送 Referer，绕过第三方防盗链
    audio.referrerPolicy = 'no-referrer'
    audio.src = url
    currentPinyinAudio = audio

    let hasEnded = false
    const finish = () => {
      if (hasEnded) return
      hasEnded = true
      if (currentPinyinAudio === audio) {
        currentPinyinAudio = null
      }
      if (onEnd) onEnd()
    }

    audio.onended = finish
    audio.onerror = (err) => {
      console.warn('百度真人语音加载失败，降级使用系统中文语音：', err)
      finish()
      // 降级使用系统语音，但传入已转换的正确发音汉字（如 "玻" 而不是 "b"）
      speakChinese(phoneticText, isSlow, onEnd)
    }

    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('音频播放被浏览器拦截或受限，降级使用系统语音：', err)
        speakChinese(phoneticText, isSlow, onEnd)
      })
    }
  } catch (err) {
    console.warn('Audio 初始化失败，降级使用系统语音：', err)
    speakChinese(phoneticText, isSlow, onEnd)
  }
}

export function speakEnglish(text, isSlow = false, onEnd = null) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  stopSpeech()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US'
  // 乌龟慢速 0.65x，兔子常速 0.95x，轻微提频至 1.15 呈现童声轻快亲和感
  utterance.rate = isSlow ? 0.65 : 0.95
  utterance.pitch = 1.15

  // 优选高品质美音发音人（如 Natural, Google, Samantha, Jenny）
  if (voices.length === 0) {
    voices = window.speechSynthesis.getVoices()
  }
  const preferredVoice = voices.find(v => 
    v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Jenny') || v.name.includes('Samantha') || v.name.includes('Google US'))
  ) || voices.find(v => v.lang.startsWith('en'))

  if (preferredVoice) {
    utterance.voice = preferredVoice
  }

  if (onEnd) {
    utterance.onend = onEnd
    utterance.onerror = onEnd
  }

  window.speechSynthesis.speak(utterance)
}

export function speakChinese(text, isSlow = false, onEnd = null) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  stopSpeech()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'zh-CN'
  utterance.rate = isSlow ? 0.7 : 0.95
  utterance.pitch = 1.1

  if (voices.length === 0) {
    voices = window.speechSynthesis.getVoices()
  }
  const preferredVoice = voices.find(v => 
    v.lang.startsWith('zh') && (v.name.includes('Natural') || v.name.includes('Xiaoxiao') || v.name.includes('Tingting') || v.name.includes('Google 普通话'))
  ) || voices.find(v => v.lang.startsWith('zh'))

  if (preferredVoice) {
    utterance.voice = preferredVoice
  }

  if (onEnd) {
    utterance.onend = onEnd
    utterance.onerror = onEnd
  }

  window.speechSynthesis.speak(utterance)
}
