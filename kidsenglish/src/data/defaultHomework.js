import cuteFrogImg from '../assets/cute_little_frog.jpg'

export const CUTE_FROG_IMAGE = cuteFrogImg

// 今日作业：Hop to It Some More! 🐸 (句子首字母大写与标点规范)
export const DEFAULT_HOMEWORK = {
  id: 'today-hop-to-it',
  date: '2026年9月16日 星期三',
  childName: '',
  theme: 'frog-toad',
  
  // 1. 英语作业：Hop to It Some More! (句子大写与标点规范 + 青蛙蟾蜍小作文)
  english: {
    title: 'Hop to It Some More! 🐸 (句子大写与标点规范)',
    topic: 'Capitalizing / Punctuating Statements',
    teacherNote: 'HOMEWORK 📝: Capitalizing/punctuating statements. Please have your children use a pencil to write their names and rewrite each sentence correctly. On another piece of paper, write three sentences about a time when they saw a frog or toad. Make sure to use capital letters and periods correctly. Many thanks! @All',
    instruction: '用铅笔工整书写名字，将每句话首字母大写并加上句号。在另一张纸上写3句关于青蛙或蟾蜍的小作文！',
    ruleTips: [
      { id: 'r1', title: '🔠 首字母必须大写', desc: '句子开头第一个字母必须大写（例如：tadpoles 变 Tadpoles，frogs 变 Frogs，toads 变 Toads）' },
      { id: 'r2', title: '🔴 句末必须加句号', desc: '陈述句写完后，句子末尾必须点上一个小圆点句号（.）' },
      { id: 'r3', title: '✏️ 空出词间距', desc: '在纸上用铅笔书写时，单词和单词之间要空出一个字母的距离（finger space）哦' },
      { id: 'r4', title: '🐸 青蛙 vs 蟾蜍科普', desc: '青蛙生活在水边，皮肤湿润光滑；蟾蜍生活在陆地灌木下，皮肤粗糙凹凸有疙瘩！' }
    ],
    // 作业纸上的 5 个真实改写练习题
    sentences: [
      {
        id: 's1',
        num: 1,
        raw: 'tadpoles become frogs or toads',
        corrected: 'Tadpoles become frogs or toads.',
        translation: '蝌蚪会长成青蛙或蟾蜍。',
        capitalChar: 'T',
        rawFirstChar: 't',
        hasPeriod: true,
        emoji: '🐸',
        image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop',
        subject: 'tadpoles',
        keyWords: [
          { en: 'tadpoles', cn: '蝌蚪' },
          { en: 'become', cn: '变成/长成' },
          { en: 'frogs', cn: '青蛙' },
          { en: 'toads', cn: '蟾蜍' }
        ],
        scienceTip: '生命周期：青蛙和蟾蜍幼年时期都是生活在水里的可爱小蝌蚪，长出后腿和前腿后脱掉尾巴变成小青蛙或蟾蜍！',
        pencilGuide: '作业纸第1题：首字母 "t" 要写成大写 "T"，句末补上小圆点句号 "."。'
      },
      {
        id: 's2',
        num: 2,
        raw: 'frogs live near water',
        corrected: 'Frogs live near water.',
        translation: '青蛙生活在水边。',
        capitalChar: 'F',
        rawFirstChar: 'f',
        hasPeriod: true,
        emoji: '🪷',
        image: 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?w=600&auto=format&fit=crop',
        subject: 'frogs',
        keyWords: [
          { en: 'frogs', cn: '青蛙' },
          { en: 'live', cn: '生活/居住' },
          { en: 'near', cn: '在...附近' },
          { en: 'water', cn: '水' }
        ],
        scienceTip: '生活习性：青蛙喜欢住在池塘、溪流和湿地水边，常常坐在荷叶上晒太阳、捉飞虫！',
        pencilGuide: '作业纸第2题：首字母 "f" 改为大写 "F"，在 "water" 后面画上圆圆的句号 "."。'
      },
      {
        id: 's3',
        num: 3,
        raw: 'toads live under bushes',
        corrected: 'Toads live under bushes.',
        translation: '蟾蜍生活在灌木丛下。',
        capitalChar: 'T',
        rawFirstChar: 't',
        hasPeriod: true,
        emoji: '🌿',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop',
        subject: 'toads',
        keyWords: [
          { en: 'toads', cn: '蟾蜍(癞蛤蟆)' },
          { en: 'live', cn: '生活' },
          { en: 'under', cn: '在...下面' },
          { en: 'bushes', cn: '灌木丛' }
        ],
        scienceTip: '生活习性：与青蛙不同，蟾蜍更喜欢生活在陆地上的花园、树林和灌木丛荫凉处。',
        pencilGuide: '作业纸第3题：把首字母小写 "t" 擦干净改成大写 "T"，结尾记得打句号 "."。'
      },
      {
        id: 's4',
        num: 4,
        raw: 'frogs have wet skin',
        corrected: 'Frogs have wet skin.',
        translation: '青蛙拥有湿润光滑的皮肤。',
        capitalChar: 'F',
        rawFirstChar: 'f',
        hasPeriod: true,
        emoji: '💧',
        image: 'https://images.unsplash.com/photo-1563281577-a7be47e20db9?w=600&auto=format&fit=crop',
        subject: 'frogs',
        keyWords: [
          { en: 'frogs', cn: '青蛙' },
          { en: 'have', cn: '拥有' },
          { en: 'wet', cn: '湿润的' },
          { en: 'skin', cn: '皮肤' }
        ],
        scienceTip: '身体秘密：青蛙皮肤湿漉漉、滑溜溜的，它们可以用湿润的皮肤帮助呼吸哦！',
        pencilGuide: '作业纸第4题：首字母 "F" 占四线三格的上两格，句末写好句号 "."。'
      },
      {
        id: 's5',
        num: 5,
        raw: 'toads have bumpy skin',
        corrected: 'Toads have bumpy skin.',
        translation: '蟾蜍拥有凹凸不平的皮肤。',
        capitalChar: 'T',
        rawFirstChar: 't',
        hasPeriod: true,
        emoji: '🪨',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop',
        subject: 'toads',
        keyWords: [
          { en: 'toads', cn: '蟾蜍' },
          { en: 'have', cn: '拥有' },
          { en: 'bumpy', cn: '凹凸不平的(有疙瘩的)' },
          { en: 'skin', cn: '皮肤' }
        ],
        scienceTip: '身体秘密：蟾蜍的皮肤干燥且布满很多小疙瘩（bumpy），粗糙的皮肤能帮它们锁住水分适应陆地生活！',
        pencilGuide: '作业纸第5题：把 "t" 改为大写 "T"，在 "skin" 后面点上醒目的句号 "."。'
      }
    ],
    // 拓展写话（另一张纸上的3句话小作文指导）
    writingWorkshop: {
      title: '📝 拓展纸上小作文：我遇见青蛙/蟾蜍的故事',
      prompt: 'On another piece of paper, write three sentences about a time that you saw a frog or toad. Make sure you use capital letters and periods correctly.',
      promptCn: '老师要求：在另一张纸上写三句话，记录一次你看见青蛙或蟾蜍的经历。务必确保首字母大写与句号标点正确！',
      tips: [
        '第 1 句：你在哪里看见的？（如池塘边、公园草地上、灌木丛下）',
        '第 2 句：它长什么样？（皮肤是光滑湿润 wet 还是粗糙凹凸 bumpy？）',
        '第 3 句：它做了什么或者你的感受？（它跳进水里？跳得很远？它真可爱！）'
      ],
      samples: [
        {
          id: 'sample-1',
          name: '范例 1：池塘边偶遇小绿蛙 🐸',
          lines: [
            { en: 'I saw a little green frog near the pond.', cn: '我在池塘边看见了一只绿色的小青蛙。' },
            { en: 'The frog had smooth and wet skin.', cn: '这只青蛙有着光滑湿润的皮肤。' },
            { en: 'It jumped high onto a big lily pad.', cn: '它高高地跳到了一片大荷叶上。' }
          ]
        },
        {
          id: 'sample-2',
          name: '范例 2：灌木丛下发现小蟾蜍 🪨',
          lines: [
            { en: 'Yesterday I saw a brown toad under the bushes.', cn: '昨天我在灌木丛下看见了一只棕色的蟾蜍。' },
            { en: 'The toad had bumpy skin and big eyes.', cn: '这只蟾蜍有着粗糙凹凸的皮肤和大大的眼睛。' },
            { en: 'It hopped slowly away into the grass.', cn: '它慢吞吞地跳进了草丛深处。' }
          ]
        }
      ],
      interactiveStarters: [
        { label: '第一句（时间/地点）', starters: ['I saw a frog near the water.', 'I saw a toad under the bushes.', 'One day I saw a little frog in the park.'] },
        { label: '第二句（外形特征）', starters: ['The frog had wet and shiny skin.', 'The toad had dry and bumpy skin.', 'It was small and green.'] },
        { label: '第三句（动作/感受）', starters: ['It jumped into the cool pond.', 'It hopped fast into the green grass.', 'I was very excited to see it.'] }
      ]
    },
    // 核心词汇闪卡
    words: [
      {
        id: 'fw1',
        word: 'tadpole',
        phonetic: '/ˈtædpoʊl/',
        translation: '小蝌蚪',
        emoji: '🟢',
        image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop',
        sentence: 'Tadpoles become frogs or toads.',
        sentenceCn: '蝌蚪会长成青蛙或蟾蜍。'
      },
      {
        id: 'fw2',
        word: 'frog',
        phonetic: '/frɔːɡ/',
        translation: '青蛙',
        emoji: '🐸',
        image: 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?w=600&auto=format&fit=crop',
        sentence: 'Frogs live near water and love swimming.',
        sentenceCn: '青蛙生活在水边，热爱游泳。'
      },
      {
        id: 'fw3',
        word: 'toad',
        phonetic: '/toʊd/',
        translation: '蟾蜍 (癞蛤蟆)',
        emoji: '🪨',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop',
        sentence: 'Toads live under bushes on land.',
        sentenceCn: '蟾蜍生活在陆地的灌木丛下。'
      },
      {
        id: 'fw4',
        word: 'wet',
        phonetic: '/wet/',
        translation: '湿润光滑的',
        emoji: '💧',
        image: 'https://images.unsplash.com/photo-1563281577-a7be47e20db9?w=600&auto=format&fit=crop',
        sentence: 'Frogs have wet and smooth skin.',
        sentenceCn: '青蛙有着湿润光滑的皮肤。'
      },
      {
        id: 'fw5',
        word: 'bumpy',
        phonetic: '/ˈbʌmpi/',
        translation: '凹凸不平的 (疙瘩的)',
        emoji: '🪵',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop',
        sentence: 'Toads have bumpy skin.',
        sentenceCn: '蟾蜍有着凹凸不平的粗糙皮肤。'
      },
      {
        id: 'fw6',
        word: 'bushes',
        phonetic: '/ˈbʊʃɪz/',
        translation: '灌木丛',
        emoji: '🌿',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop',
        sentence: 'The toad is hiding under the green bushes.',
        sentenceCn: '蟾蜍正在绿色的灌木丛下躲藏。'
      }
    ]
  },

  // 2. 语文拼音复习（声母 b、p、m、f 与带调韵母拼读）
  pinyin: {
    teacherNote: '拼音复习：巩固声母 b、p、m、f 与带调单韵母的拼读，100% 真人发音朗读。',
    letters: [
      { id: 'p1', char: 'b', type: '声母', mnemonic: '右下半圆 b b b，听广播 📻', soundTip: '双唇闭紧，突然放开' },
      { id: 'p2', char: 'p', type: '声母', mnemonic: '右上半圆 p p p，端盆泼水 💦', soundTip: '双唇紧闭，用力喷气' },
      { id: 'p3', char: 'm', type: '声母', mnemonic: '两个门洞 m m m，小猫咪 🐱', soundTip: '双唇闭合，鼻腔出气' },
      { id: 'p4', char: 'f', type: '声母', mnemonic: '一根拐棍 f f f，老爷爷 👴', soundTip: '上齿轻触下唇，摩擦出气' }
    ],
    blends: [
      { id: 'bl1', initial: 'b', final: 'ā', result: 'bā', word: '八只鸭子 🦆', example: '数字 8 (八)' },
      { id: 'bl2', initial: 'p', final: 'á', result: 'pá', word: '小猴爬树 🐒', example: '爬山' },
      { id: 'bl3', initial: 'm', final: 'ā', result: 'mā', word: '可爱的妈妈 👩', example: '妈妈我爱你' },
      { id: 'bl4', initial: 'f', final: 'à', result: 'fà', word: '理发/头发 💇', example: '理发店' }
    ]
  },

  // 3. 语文儿歌指读（配合今日青蛙主题的《小青蛙》儿歌）
  reading: {
    title: '儿歌《小青蛙》',
    author: '经典幼儿童谣',
    teacherNote: '配合今日英语青蛙主题，大声朗读经典儿歌《小青蛙》，字字指读！',
    image: cuteFrogImg,
    lines: [
      [
        { char: '小', pinyin: 'xiǎo' }, { char: '青', pinyin: 'qīng' }, { char: '蛙', pinyin: 'wā' }, { char: '，', pinyin: '' },
        { char: '呱', pinyin: 'guā' }, { char: '呱', pinyin: 'guā' }, { char: '呱', pinyin: 'guā' }, { char: '。', pinyin: '' }
      ],
      [
        { char: '绿', pinyin: 'lǜ' }, { char: '衣', pinyin: 'yī' }, { char: '裳', pinyin: 'shang' }, { char: '，', pinyin: '' },
        { char: '白', pinyin: 'bái' }, { char: '肚', pinyin: 'dù' }, { char: '皮', pinyin: 'pí' }, { char: '。', pinyin: '' }
      ],
      [
        { char: '水', pinyin: 'shuǐ' }, { char: '里', pinyin: 'lǐ' }, { char: '游', pinyin: 'yóu' }, { char: '，', pinyin: '' },
        { char: '荷', pinyin: 'hé' }, { char: '叶', pinyin: 'yè' }, { char: '跳', pinyin: 'tiào' }, { char: '。', pinyin: '' }
      ],
      [
        { char: '捉', pinyin: 'zhuō' }, { char: '害', pinyin: 'hài' }, { char: '虫', pinyin: 'chóng' }, { char: '，', pinyin: '' },
        { char: '保', pinyin: 'bǎo' }, { char: '庄', pinyin: 'zhuāng' }, { char: '稼', pinyin: 'jia' }, { char: '。', pinyin: '' }
      ]
    ]
  }
}

// 往期作业：2026年9月15日 Action Words 动作词
export const HOMEWORK_2026_09_15 = {
  id: 'archive-2026-09-15',
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
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop',
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

// 历史作业归档列表库（支持按日期翻阅与周末复习）
export const DEFAULT_HOMEWORK_LIST = [
  DEFAULT_HOMEWORK,
  HOMEWORK_2026_09_15,
  {
    id: 'archive-2026-09-14',
    date: '2026年9月14日 星期一',
    childName: '',
    english: {
      title: 'Animals & Fruits 动物与水果小明星',
      teacherNote: '今天复习日常高频单词：apple, banana, cat, dog，要求能看图说词，并拼读出简单短句。',
      words: [
        {
          id: 'w-prev-1',
          word: 'apple',
          gender: 'she',
          phonetic: '/ˈæpl/',
          translation: '苹果',
          emoji: '🍎',
          image: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=600&auto=format&fit=crop',
          sentence: 'What is she eating? She is eating a sweet apple.',
          sentenceCn: '她在吃什么？她在吃一个甜甜的苹果。'
        },
        {
          id: 'w-prev-2',
          word: 'banana',
          gender: 'he',
          phonetic: '/bəˈnænə/',
          translation: '香蕉',
          emoji: '🍌',
          image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=600&auto=format&fit=crop',
          sentence: 'What is he holding? He is holding a yellow banana.',
          sentenceCn: '他手里拿着什么？他手里拿着一根黄香蕉。'
        },
        {
          id: 'w-prev-3',
          word: 'cat',
          gender: 'she',
          phonetic: '/kæt/',
          translation: '小猫',
          emoji: '🐱',
          image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop',
          sentence: 'Look! The cute cat is sleeping.',
          sentenceCn: '看呀！可爱的小猫正在睡觉。'
        },
        {
          id: 'w-prev-4',
          word: 'dog',
          gender: 'he',
          phonetic: '/dɔːɡ/',
          translation: '小狗',
          emoji: '🐶',
          image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop',
          sentence: 'The friendly dog is running happily.',
          sentenceCn: '友好的小狗正在开心地跑。'
        }
      ],
      dailySentence: {
        en: 'I love my cute puppy and sweet apples!',
        cn: '我喜欢可爱的小狗和甜甜的苹果！'
      }
    },
    pinyin: {
      teacherNote: '单韵母 a、o 巩固练习，四声调熟练认读。',
      letters: [
        { id: 'p-prev-1', char: 'a', type: '单韵母', mnemonic: '张大嘴巴 a a a，医生看喉咙', soundTip: '声音洪亮长' },
        { id: 'p-prev-2', char: 'o', type: '单韵母', mnemonic: '圆圆嘴巴 o o o，公鸡喔喔叫', soundTip: '嘴唇拢圆' }
      ],
      blends: [
        { id: 'bl-prev-1', initial: 'b', final: 'ā', result: 'bā', word: '八只小鸭 🦆', example: '数字八' },
        { id: 'bl-prev-2', initial: 'p', final: 'ō', result: 'pō', word: '山坡 ⛰️', example: '小山坡' }
      ]
    },
    reading: {
      title: '古诗《咏鹅》',
      author: '骆宾王',
      teacherNote: '要求字字指读，感受古诗韵律，试着背诵出整首诗！',
      image: 'https://images.unsplash.com/photo-1555852095-64e7428df0fa?w=600&auto=format&fit=crop',
      lines: [
        [{ char: '鹅', pinyin: 'é' }, { char: '，', pinyin: '' }, { char: '鹅', pinyin: 'é' }, { char: '，', pinyin: '' }, { char: '鹅', pinyin: 'é' }, { char: '，', pinyin: '' }],
        [{ char: '曲', pinyin: 'qū' }, { char: '项', pinyin: 'xiàng' }, { char: '向', pinyin: 'xiàng' }, { char: '天', pinyin: 'tiān' }, { char: '歌', pinyin: 'gē' }, { char: '。', pinyin: '' }],
        [{ char: '白', pinyin: 'bái' }, { char: '毛', pinyin: 'máo' }, { char: '浮', pinyin: 'fú' }, { char: '绿', pinyin: 'lǜ' }, { char: '水', pinyin: 'shuǐ' }, { char: '，', pinyin: '' }],
        [{ char: '红', pinyin: 'hóng' }, { char: '掌', pinyin: 'zhǎng' }, { char: '拨', pinyin: 'bō' }, { char: '清', pinyin: 'qīng' }, { char: '波', pinyin: 'bō' }, { char: '。', pinyin: '' }]
      ]
    }
  },
  {
    id: 'archive-2026-09-13',
    date: '2026年9月13日 星期日',
    childName: '',
    english: {
      title: 'Nature & Colors 大自然与颜色',
      teacherNote: '周末亲子作业：复习 sun, flower, star, butterfly 4个大自然词汇，说出一句喜欢的事物。',
      words: [
        {
          id: 'w-prev-5',
          word: 'sun',
          gender: 'he',
          phonetic: '/sʌn/',
          translation: '大太阳',
          emoji: '☀️',
          image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop',
          sentence: 'The big warm sun is shining bright.',
          sentenceCn: '温暖的大太阳正在闪闪发光。'
        },
        {
          id: 'w-prev-6',
          word: 'flower',
          gender: 'she',
          phonetic: '/ˈflaʊər/',
          translation: '漂亮的花',
          emoji: '🌸',
          image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&auto=format&fit=crop',
          sentence: 'Look at the pretty flower in the garden.',
          sentenceCn: '看花园里那朵漂亮的小花。'
        },
        {
          id: 'w-prev-7',
          word: 'star',
          gender: 'he',
          phonetic: '/stɑːr/',
          translation: '小星星',
          emoji: '⭐',
          image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop',
          sentence: 'Twinkle twinkle little star in the night sky.',
          sentenceCn: '夜空里一闪一闪的小星星。'
        },
        {
          id: 'w-prev-8',
          word: 'butterfly',
          gender: 'she',
          phonetic: '/ˈbʌtərflaɪ/',
          translation: '蝴蝶',
          emoji: '🦋',
          image: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=600&auto=format&fit=crop',
          sentence: 'A pink butterfly is dancing in the air.',
          sentenceCn: '一只粉色蝴蝶正在空中跳舞。'
        }
      ],
      dailySentence: {
        en: 'The bright sun and pretty butterfly bring me joy!',
        cn: '明媚的阳光和漂亮的蝴蝶带给我快乐！'
      }
    },
    pinyin: {
      teacherNote: '声母 m、f 的发音朗读与四声调练习。',
      letters: [
        { id: 'p-prev-3', char: 'm', type: '声母', mnemonic: '两个门洞 m m m，小猫咪', soundTip: '双唇闭合，鼻腔发音' },
        { id: 'p-prev-4', char: 'f', type: '声母', mnemonic: '一根拐棍 f f f，老爷爷', soundTip: '上牙轻碰下唇' }
      ],
      blends: [
        { id: 'bl-prev-3', initial: 'm', final: 'ā', result: 'mā', word: '妈妈 👩', example: '好妈妈' },
        { id: 'bl-prev-4', initial: 'f', final: 'à', result: 'fà', word: '头发/理发 💇', example: '梳理头发' }
      ]
    },
    reading: {
      title: '儿歌《小手拍拍》',
      author: '幼儿经典儿歌',
      teacherNote: '边做手指动作边跟读，熟练背诵！',
      image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=600&auto=format&fit=crop',
      lines: [
        [{ char: '小', pinyin: 'xiǎo' }, { char: '手', pinyin: 'shǒu' }, { char: '拍', pinyin: 'pāi' }, { char: '拍', pinyin: 'pāi' }, { char: '，', pinyin: '' }, { char: '手', pinyin: 'shǒu' }, { char: '指', pinyin: 'zhǐ' }, { char: '伸', pinyin: 'shēn' }, { char: '出', pinyin: 'chū' }, { char: '来', pinyin: 'lái' }, { char: '。', pinyin: '' }],
        [{ char: '眼', pinyin: 'yǎn' }, { char: '睛', pinyin: 'jing' }, { char: '在', pinyin: 'zài' }, { char: '哪', pinyin: 'nǎ' }, { char: '里', pinyin: 'lǐ' }, { char: '，', pinyin: '' }, { char: '用', pinyin: 'yòng' }, { char: '手', pinyin: 'shǒu' }, { char: '指', pinyin: 'zhǐ' }, { char: '出', pinyin: 'chū' }, { char: '来', pinyin: 'lái' }, { char: '。', pinyin: '' }]
      ]
    }
  }
]

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
  { word: 'drinking', phonetic: '/ˈdrɪŋkɪŋ/', translation: '喝水', emoji: '🥤', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop', sentence: 'What is she doing? She is drinking water.', sentenceCn: '她在做什么？她正在喝水。' },
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
