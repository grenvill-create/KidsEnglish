// 康文幼儿园 BrownBear 班今日真实作业：Action Words (动作词) 与 "What is he/she doing?" 句型背诵

export const DEFAULT_HOMEWORK = {
  id: 'today-action-words',
  date: '2026年9月15日 星期二',
  childName: '',
  
  // 1. 英语作业：Action Words (动作词剪贴与背诵)
  english: {
    title: 'Action Words 动作词大冒险',
    teacherNote: '老师提示：今天练习 Action Words (动作词)，熟练背诵问答句型 "What is he/she doing?" -> "He/She is ...ing." 明天课堂分享，请在家里多多练习大声背诵！剪纸作业请用剪刀剪下动作词贴好，不要画下划线，记得写名字哦！',
    targetPattern: {
      questionHe: 'What is he doing?',
      questionShe: 'What is she doing?',
      answerHe: 'He is ...ing.',
      answerShe: 'She is ...ing.'
    },
    // 作业纸上的 16 个动作词完整库
    words: [
      {
        id: 'w1',
        word: 'drinking',
        baseWord: 'drink',
        gender: 'she',
        phonetic: '/ˈdrɪŋkɪŋ/',
        translation: '喝水',
        emoji: '🥤',
        image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop',
        sentence: 'What is she doing? She is drinking water.',
        sentenceCn: '她在做什么？她正在喝水。'
      },
      {
        id: 'w2',
        word: 'eating',
        baseWord: 'eat',
        gender: 'she',
        phonetic: '/ˈiːtɪŋ/',
        translation: '吃东西',
        emoji: '🍜',
        image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop',
        sentence: 'What is she doing? She is eating yummy noodles.',
        sentenceCn: '她在做什么？她正在吃香喷喷的面条。'
      },
      {
        id: 'w3',
        word: 'waving',
        baseWord: 'wave',
        gender: 'he',
        phonetic: '/ˈweɪvɪŋ/',
        translation: '挥手打招呼',
        emoji: '👋',
        image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop',
        sentence: 'What is he doing? He is waving his hand.',
        sentenceCn: '他在做什么？他正在热情地挥手。'
      },
      {
        id: 'w4',
        word: 'listening',
        baseWord: 'listen',
        gender: 'she',
        phonetic: '/ˈlɪsnɪŋ/',
        translation: '听声音/音乐',
        emoji: '🎧',
        image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&auto=format&fit=crop',
        sentence: 'What is she doing? She is listening to music.',
        sentenceCn: '她在做什么？她正在认真听音乐。'
      },
      {
        id: 'w5',
        word: 'cutting',
        baseWord: 'cut',
        gender: 'she',
        phonetic: '/ˈkʌtɪŋ/',
        translation: '用剪刀剪纸',
        emoji: '✂️',
        image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&auto=format&fit=crop',
        sentence: 'What is she doing? She is cutting paper with scissors.',
        sentenceCn: '她在做什么？她正在用剪刀剪纸。'
      },
      {
        id: 'w6',
        word: 'writing',
        baseWord: 'write',
        gender: 'he',
        phonetic: '/ˈraɪtɪŋ/',
        translation: '写字/画画',
        emoji: '✏️',
        image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop',
        sentence: 'What is he doing? He is writing his name.',
        sentenceCn: '他在做什么？他正在本子上写自己的名字。'
      },
      {
        id: 'w7',
        word: 'brushing',
        baseWord: 'brush',
        gender: 'she',
        phonetic: '/ˈbrʌʃɪŋ/',
        translation: '刷牙',
        emoji: '🪥',
        image: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=600&auto=format&fit=crop',
        sentence: 'What is she doing? She is brushing her teeth.',
        sentenceCn: '她在做什么？她正在认真刷牙。'
      },
      {
        id: 'w8',
        word: 'licking',
        baseWord: 'lick',
        gender: 'she',
        phonetic: '/ˈlɪkɪŋ/',
        translation: '舔冰淇淋',
        emoji: '🍦',
        image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&auto=format&fit=crop',
        sentence: 'What is she doing? She is licking sweet ice cream.',
        sentenceCn: '她在做什么？她正在舔甜甜的冰淇淋。'
      },
      {
        id: 'w9',
        word: 'blowing',
        baseWord: 'blow',
        gender: 'he',
        phonetic: '/ˈbloʊɪŋ/',
        translation: '吹气球/吹泡泡',
        emoji: '🎈',
        image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop',
        sentence: 'What is he doing? He is blowing a big balloon.',
        sentenceCn: '他在做什么？他正在吹一个大大的彩色气球。'
      },
      {
        id: 'w10',
        word: 'sneezing',
        baseWord: 'sneeze',
        gender: 'he',
        phonetic: '/ˈsniːzɪŋ/',
        translation: '打喷嚏',
        emoji: '🤧',
        image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop',
        sentence: 'What is he doing? Achoo! He is sneezing.',
        sentenceCn: '他在做什么？阿嚏！他正在打喷嚏。'
      },
      {
        id: 'w11',
        word: 'snoring',
        baseWord: 'snore',
        gender: 'he',
        phonetic: '/ˈsnɔːrɪŋ/',
        translation: '睡觉打呼噜',
        emoji: '💤',
        image: 'https://images.unsplash.com/photo-1520206183501-b80df61043c2?w=600&auto=format&fit=crop',
        sentence: 'What is he doing? Shh! He is snoring in bed.',
        sentenceCn: '他在做什么？嘘！他在床上睡觉打呼噜呢。'
      },
      {
        id: 'w12',
        word: 'feeding',
        baseWord: 'feed',
        gender: 'she',
        phonetic: '/ˈfiːdɪŋ/',
        translation: '喂小动物',
        emoji: '🐥',
        image: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=600&auto=format&fit=crop',
        sentence: 'What is she doing? She is feeding the little puppy.',
        sentenceCn: '她在做什么？她正在给可爱的小狗喂食。'
      },
      {
        id: 'w13',
        word: 'juggling',
        baseWord: 'juggle',
        gender: 'he',
        phonetic: '/ˈdʒʌɡlɪŋ/',
        translation: '抛球杂耍',
        emoji: '🤹',
        image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop',
        sentence: 'What is he doing? He is juggling colorful balls.',
        sentenceCn: '他在做什么？他正在杂耍抛彩球。'
      },
      {
        id: 'w14',
        word: 'hammering',
        baseWord: 'hammer',
        gender: 'he',
        phonetic: '/ˈhæmərɪŋ/',
        translation: '用锤子敲钉子',
        emoji: '🔨',
        image: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&auto=format&fit=crop',
        sentence: 'What is he doing? He is hammering nails.',
        sentenceCn: '他在做什么？他正在用铁锤敲钉子。'
      },
      {
        id: 'w15',
        word: 'cracking',
        baseWord: 'crack',
        gender: 'she',
        phonetic: '/ˈkrækɪŋ/',
        translation: '敲碎/打鸡蛋',
        emoji: '🥚',
        image: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=600&auto=format&fit=crop',
        sentence: 'What is she doing? She is cracking an egg into the bowl.',
        sentenceCn: '她在做什么？她正在把鸡蛋敲破打进碗里。'
      },
      {
        id: 'w16',
        word: 'banging',
        baseWord: 'bang',
        gender: 'he',
        phonetic: '/ˈbæŋɪŋ/',
        translation: '敲打/咚咚敲鼓',
        emoji: '🥁',
        image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=600&auto=format&fit=crop',
        sentence: 'What is he doing? Bang bang! He is banging on the drum.',
        sentenceCn: '他在做什么？咚咚咚！他正在用力敲鼓。'
      }
    ],
    dailySentence: {
      en: 'What is she doing? She is drinking water and smiling happily!',
      cn: '她在做什么？她正在喝水，并且开心地微笑着！'
    }
  },

  // 2. 语文拼音复习
  pinyin: {
    teacherNote: '拼音复习：巩固声母 b、p、m、f 与带调单韵母的拼读，练习生活常用词。',
    letters: [
      { id: 'p1', char: 'b', type: '声母', mnemonic: '右下半圆 b b b，听广播', soundTip: '双唇闭紧，突然放开' },
      { id: 'p2', char: 'p', type: '声母', mnemonic: '右上半圆 p p p，端盆泼水', soundTip: '双唇紧闭，用力喷气' },
      { id: 'p3', char: 'm', type: '声母', mnemonic: '两个门洞 m m m，小猫咪', soundTip: '双唇闭合，鼻腔出气' },
      { id: 'p4', char: 'f', type: '声母', mnemonic: '一根拐棍 f f f，老爷爷', soundTip: '上齿轻触下唇，摩擦出气' }
    ],
    blends: [
      { id: 'bl1', initial: 'b', final: 'ā', result: 'bā', word: '八只鸭子 🦆', example: '数字 8 (八)' },
      { id: 'bl2', initial: 'p', final: 'á', result: 'pá', word: '小猴爬树 🐒', example: '爬山' },
      { id: 'bl3', initial: 'm', final: 'ā', result: 'mā', word: '可爱的妈妈 👩', example: '妈妈我爱你' },
      { id: 'bl4', initial: 'f', final: 'à', result: 'fà', word: '理发/头发 💇', example: '理发店' }
    ]
  },

  // 3. 语文课文儿歌指读
  reading: {
    title: '儿歌《小白兔》',
    author: '经典幼儿童谣',
    teacherNote: '要求熟练指读，注意字正腔圆，试着根据拼音大声背诵给爸爸妈妈听！',
    image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&auto=format&fit=crop',
    lines: [
      [
        { char: '小', pinyin: 'xiǎo' }, { char: '白', pinyin: 'bái' }, { char: '兔', pinyin: 'tù' }, { char: '，', pinyin: '' },
        { char: '白', pinyin: 'bái' }, { char: '又', pinyin: 'yòu' }, { char: '白', pinyin: 'bái' }, { char: '，', pinyin: '' }
      ],
      [
        { char: '两', pinyin: 'liǎng' }, { char: '只', pinyin: 'zhī' }, { char: '耳', pinyin: 'ěr' }, { char: '朵', pinyin: 'duo' },
        { char: '竖', pinyin: 'shù' }, { char: '起', pinyin: 'qǐ' }, { char: '来', pinyin: 'lái' }, { char: '。', pinyin: '' }
      ],
      [
        { char: '爱', pinyin: 'ài' }, { char: '吃', pinyin: 'chī' }, { char: '萝', pinyin: 'luó' }, { char: '卜', pinyin: 'bo' },
        { char: '爱', pinyin: 'ài' }, { char: '吃', pinyin: 'chī' }, { char: '菜', pinyin: 'cài' }, { char: '，', pinyin: '' }
      ],
      [
        { char: '蹦', pinyin: 'bèng' }, { char: '蹦', pinyin: 'bèng' }, { char: '跳', pinyin: 'tiào' }, { char: '跳', pinyin: 'tiào' },
        { char: '真', pinyin: 'zhēn' }, { char: '可', pinyin: 'kě' }, { char: '爱', pinyin: 'ài' }, { char: '。', pinyin: '' }
      ]
    ]
  }
}

// 收集贴纸
export const STICKERS = [
  { id: 's1', icon: '🦄', name: '梦幻独角兽', desc: '动作词掌握得超快！' },
  { id: 's2', icon: '🍓', name: '草莓甜心', desc: '口语背诵问答小明星！' },
  { id: 's3', icon: '👑', name: '闪耀小皇冠', desc: '剪贴配对全对！' },
  { id: 's4', icon: '🐰', name: '萌萌小兔', desc: '今天也是活力满满！' },
  { id: 's5', icon: '🌈', name: '幸运彩虹', desc: '全部作业大通关！' },
  { id: 's6', icon: '🪄', name: '魔法仙女棒', desc: '句型对答如流！' },
  { id: 's7', icon: '🐬', name: '欢喜小海豚', desc: '动作模仿最可爱！' },
  { id: 's8', icon: '🍦', name: '香草冰淇淋', desc: '自觉做作业好习惯！' },
  { id: 's9', icon: '🌸', name: '粉粉樱花', desc: '认真专注最棒！' },
  { id: 's10', icon: '🧸', name: '温暖泰迪熊', desc: '坚持打卡小冠军！' },
  { id: 's11', icon: '🎈', name: '快乐小气球', desc: '明天课堂自信发言！' },
  { id: 's12', icon: '⭐', name: '超级无敌大金星', desc: '今日终极大勋章！' }
]

export const PRESET_WORDS_BANK = [
  { word: 'drinking', phonetic: '/ˈdrɪŋkɪŋ/', translation: '喝水', emoji: '🥤', image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop', sentence: 'What is she doing? She is drinking water.', sentenceCn: '她在做什么？她正在喝水。' },
  { word: 'eating', phonetic: '/ˈiːtɪŋ/', translation: '吃东西', emoji: '🍜', image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop', sentence: 'What is she doing? She is eating yummy noodles.', sentenceCn: '她在做什么？她正在吃香喷喷的面条。' },
  { word: 'waving', phonetic: '/ˈweɪvɪŋ/', translation: '招手', emoji: '👋', image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop', sentence: 'What is he doing? He is waving his hand.', sentenceCn: '他在做什么？他正在挥手。' },
  { word: 'listening', phonetic: '/ˈlɪsnɪŋ/', translation: '听音乐', emoji: '🎧', image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&auto=format&fit=crop', sentence: 'What is she doing? She is listening to music.', sentenceCn: '她在做什么？她正在听音乐。' }
]

export const PRESET_PINYIN_BANK = [
  { char: 'm', type: '声母', mnemonic: '两个门洞 m m m，摸瞎子' },
  { char: 'f', type: '声母', mnemonic: '一根拐棍 f f f，老爷爷' }
]

export const PRESET_READING_BANK = [
  {
    title: '古诗《咏鹅》',
    author: '骆宾王',
    image: 'https://images.unsplash.com/photo-1555852095-64e7428df0fa?w=600&auto=format&fit=crop',
    lines: [
      [{ char: '鹅', pinyin: 'é' }, { char: '，', pinyin: '' }, { char: '鹅', pinyin: 'é' }, { char: '，', pinyin: '' }, { char: '鹅', pinyin: 'é' }, { char: '，', pinyin: '' }],
      [{ char: '曲', pinyin: 'qū' }, { char: '项', pinyin: 'xiàng' }, { char: '向', pinyin: 'xiàng' }, { char: '天', pinyin: 'tiān' }, { char: '歌', pinyin: 'gē' }, { char: '。', pinyin: '' }],
      [{ char: '白', pinyin: 'bái' }, { char: '毛', pinyin: 'máo' }, { char: '浮', pinyin: 'fú' }, { char: '绿', pinyin: 'lǜ' }, { char: '水', pinyin: 'shuǐ' }, { char: '，', pinyin: '' }],
      [{ char: '红', pinyin: 'hóng' }, { char: '掌', pinyin: 'zhǎng' }, { char: '拨', pinyin: 'bō' }, { char: '清', pinyin: 'qīng' }, { char: '波', pinyin: 'bō' }, { char: '。', pinyin: '' }]
    ]
  }
]
