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

// 预生成的百度真人发音标准 MP3 离线映射表（全部 70 个标准发音文件）
const LOCAL_AUDIO_FILES = {
  // 23 个声母标准真人发音（玻、坡、摸、佛、得、特、讷、勒...）
  'b': 'b.mp3', 'p': 'p.mp3', 'm': 'm.mp3', 'f': 'f.mp3',
  'd': 'd.mp3', 't': 't.mp3', 'n': 'n.mp3', 'l': 'l.mp3',
  'g': 'g.mp3', 'k': 'k.mp3', 'h': 'h.mp3',
  'j': 'j.mp3', 'q': 'q.mp3', 'x': 'x.mp3',
  'zh': 'zh.mp3', 'ch': 'ch.mp3', 'sh': 'sh.mp3', 'r': 'r.mp3',
  'z': 'z.mp3', 'c': 'c.mp3', 's': 's.mp3',
  'y': 'y.mp3', 'w': 'w.mp3',

  // 单韵母标准真人发音
  'a': 'a.mp3', 'o': 'o.mp3', 'e': 'e.mp3', 'i': 'i.mp3', 'u': 'u.mp3', 'v': 'v.mp3', 'ü': 'v.mp3',

  // 慢速跟读版（清晰延长拖音）
  'b_slow': 'b_slow.mp3', 'p_slow': 'p_slow.mp3', 'm_slow': 'm_slow.mp3', 'f_slow': 'f_slow.mp3',
  'a_slow': 'a_slow.mp3', 'o_slow': 'o_slow.mp3', 'e_slow': 'e_slow.mp3',

  // 四声调韵母
  'ā': 'a_1.mp3', 'á': 'a_2.mp3', 'ǎ': 'a_3.mp3', 'à': 'a_4.mp3',
  'a_1': 'a_1.mp3', 'a_2': 'a_2.mp3', 'a_3': 'a_3.mp3', 'a_4': 'a_4.mp3',
  'ō': 'o_1.mp3', 'ó': 'o_2.mp3', 'ǒ': 'o_3.mp3', 'ò': 'o_4.mp3',
  'o_1': 'o_1.mp3', 'o_2': 'o_2.mp3', 'o_3': 'o_3.mp3', 'o_4': 'o_4.mp3',
  'ē': 'e_1.mp3', 'é': 'e_2.mp3',
  'e_1': 'e_1.mp3', 'e_2': 'e_2.mp3',
  'ī': 'i_1.mp3', 'i_1': 'i_1.mp3',
  'ū': 'u_1.mp3', 'u_1': 'u_1.mp3',

  // 常用拼读音节
  'bā': 'ba_1.mp3', 'ba': 'ba_1.mp3', 'ba_1': 'ba_1.mp3',
  'pá': 'pa_2.mp3', 'pa': 'pa_2.mp3', 'pa_2': 'pa_2.mp3',
  'mā': 'ma_1.mp3', 'ma': 'ma_1.mp3', 'ma_1': 'ma_1.mp3',
  'fà': 'fa_4.mp3', 'fa': 'fa_4.mp3', 'fa_4': 'fa_4.mp3',
  'pō': 'po_1.mp3', 'po': 'po_1.mp3', 'po_1': 'po_1.mp3',
  'bō': 'bo_1.mp3', 'bo': 'bo_1.mp3', 'bo_1': 'bo_1.mp3',

  // 连贯声韵拼读碰碰乐完整语音（如：玻……啊……八！八只鸭子！）
  'blend_bl1': 'blend_bl1.mp3',
  'blend_bl2': 'blend_bl2.mp3',
  'blend_bl3': 'blend_bl3.mp3',
  'blend_bl4': 'blend_bl4.mp3',
  'blend_bl_prev_1': 'blend_bl_prev_1.mp3',
  'blend_bl_prev_2': 'blend_bl_prev_2.mp3',
  'blend_bl_prev_3': 'blend_bl_prev_3.mp3',
  'blend_bl_prev_4': 'blend_bl_prev_4.mp3',

  // 生活例词真人朗读（如：八，八只鸭子）
  'word_bl1': 'word_bl1.mp3',
  'word_bl2': 'word_bl2.mp3',
  'word_bl3': 'word_bl3.mp3',
  'word_bl4': 'word_bl4.mp3',
  'word_bl_prev_1': 'word_bl_prev_1.mp3',
  'word_bl_prev_2': 'word_bl_prev_2.mp3',
  'word_bl_prev_3': 'word_bl_prev_3.mp3',
  'word_bl_prev_4': 'word_bl_prev_4.mp3'
}

/**
 * 智能匹配拼音音频文件名
 */
export function resolvePinyinAudioFile(text, isSlow = false) {
  if (!text) return null
  const clean = text.trim()
  const key = clean.toLowerCase().replace(/-/g, '_')

  // 1. 如果指定慢速且存在 slow 版本
  if (isSlow) {
    if (LOCAL_AUDIO_FILES[`${key}_slow`]) return LOCAL_AUDIO_FILES[`${key}_slow`]
    const baseChar = key.replace(/_slow$/, '')
    if (LOCAL_AUDIO_FILES[`${baseChar}_slow`]) return LOCAL_AUDIO_FILES[`${baseChar}_slow`]
  }

  // 2. 精确命中本地映射表
  if (LOCAL_AUDIO_FILES[key]) {
    return LOCAL_AUDIO_FILES[key]
  }

  // 3. 去除常见标点与 emoji 后匹配
  const noPunct = key.replace(/[……!！,，。 ?？\s\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
  if (LOCAL_AUDIO_FILES[noPunct]) {
    return LOCAL_AUDIO_FILES[noPunct]
  }

  // 4. 拼读碰碰乐包含的关键词智能匹配
  if (key.includes('blend_bl1') || (key.includes('b') && key.includes('鸭子'))) return 'blend_bl1.mp3'
  if (key.includes('blend_bl2') || (key.includes('p') && key.includes('爬树'))) return 'blend_bl2.mp3'
  if (key.includes('blend_bl3') || (key.includes('m') && key.includes('妈妈'))) return 'blend_bl3.mp3'
  if (key.includes('blend_bl4') || (key.includes('f') && (key.includes('理发') || key.includes('头发')))) return 'blend_bl4.mp3'

  if (key.includes('word_bl1') || (key.includes('八') && key.includes('鸭子'))) return 'word_bl1.mp3'
  if (key.includes('word_bl2') || (key.includes('爬') && key.includes('爬树'))) return 'word_bl2.mp3'
  if (key.includes('word_bl3') || (key.includes('妈') && key.includes('妈妈'))) return 'word_bl3.mp3'
  if (key.includes('word_bl4') || (key.includes('发') && (key.includes('理发') || key.includes('头发')))) return 'word_bl4.mp3'

  // 5. 往期作业例词匹配
  if (key.includes('blend_bl_prev_1') || (key.includes('b') && key.includes('数字八'))) return 'blend_bl_prev_1.mp3'
  if (key.includes('blend_bl_prev_2') || (key.includes('p') && key.includes('山坡'))) return 'blend_bl_prev_2.mp3'
  if (key.includes('blend_bl_prev_3') || (key.includes('m') && key.includes('好妈妈'))) return 'blend_bl_prev_3.mp3'
  if (key.includes('blend_bl_prev_4') || (key.includes('f') && key.includes('梳理头发'))) return 'blend_bl_prev_4.mp3'

  if (key.includes('word_bl_prev_1') || (key.includes('八') && key.includes('数字八'))) return 'word_bl_prev_1.mp3'
  if (key.includes('word_bl_prev_2') || (key.includes('坡') && key.includes('山坡'))) return 'word_bl_prev_2.mp3'
  if (key.includes('word_bl_prev_3') || (key.includes('妈') && key.includes('好妈妈'))) return 'word_bl_prev_3.mp3'
  if (key.includes('word_bl_prev_4') || (key.includes('发') && key.includes('梳理头发'))) return 'word_bl_prev_4.mp3'

  // 6. 首个拼音字母提取
  const letterMatch = clean.match(/^[a-zA-Zāáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜ]+/i)
  if (letterMatch && LOCAL_AUDIO_FILES[letterMatch[0].toLowerCase()]) {
    return LOCAL_AUDIO_FILES[letterMatch[0].toLowerCase()]
  }

  return null
}

/**
 * 获取音频文件的绝对完整 URL，完美兼容本地开发、手机访问与 GitHub Pages
 */
export function getPinyinAudioUrl(filename) {
  if (!filename) return null
  if (typeof window !== 'undefined') {
    let pathname = window.location.pathname
    if (!pathname.endsWith('/')) {
      pathname = pathname + '/'
    }
    return `${window.location.origin}${pathname}pinyin_audio/${filename}`
  }
  return `./pinyin_audio/${filename}`
}

/**
 * 百度真人发音：用于汉语拼音字母认读与声韵拼读（100% 离线高清真人标准音，绝不发英文字母音）
 * @param {string} text 拼音字母（如 'b', 'p', 'bā'）或拼读流程标识
 * @param {boolean} isSlow 是否为慢速模式（儿童跟读模式）
 * @param {Function|null} onEnd 播放结束回调
 */
export function speakPinyinBaidu(text, isSlow = false, onEnd = null) {
  stopSpeech()

  const localFileName = resolvePinyinAudioFile(text, isSlow)
  const audioUrl = localFileName ? getPinyinAudioUrl(localFileName) : null

  if (audioUrl) {
    try {
      const audio = new Audio(audioUrl)
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
        console.warn('本地真人拼音音频加载失败：', audioUrl, err)
        finish()
      }

      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('音频播放受限或用户尚未交互：', err)
          finish()
        })
      }
      return
    } catch (err) {
      console.warn('Audio 初始化失败：', err)
    }
  }

  // 兜底保护：若未命中本地预存音频，严格防止使用英文语音引擎读出英文字母
  const phoneticText = getPinyinPhoneticText(text)
  if (phoneticText && !/[a-zA-Z]/.test(phoneticText)) {
    speakChinese(phoneticText, isSlow, onEnd)
  } else {
    console.warn('未找到匹配的拼音真人音频，已拦截以防误发英文字母音：', text)
    if (onEnd) onEnd()
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
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd()
    return
  }
  stopSpeech()

  if (voices.length === 0) {
    voices = window.speechSynthesis.getVoices()
  }

  // 严格检查：必须有中文发音人！绝对不能用英文引擎读汉语拼音，避免发出 "bee, pee" 等英文字母音
  const hasChineseVoice = voices.some(v => v.lang.startsWith('zh'))
  if (!hasChineseVoice && voices.length > 0) {
    console.warn('设备未检测到中文语音包，为防误发英文读音，已拦截系统朗读')
    if (onEnd) onEnd()
    return
  }

  // 确保朗读文本中绝对没有剩余英文字母
  if (/[a-zA-Z]/.test(text)) {
    console.warn('发音文本含有未转换的英文字母，已阻止朗读：', text)
    if (onEnd) onEnd()
    return
  }

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'zh-CN'
  utterance.rate = isSlow ? 0.7 : 0.95
  utterance.pitch = 1.1

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
