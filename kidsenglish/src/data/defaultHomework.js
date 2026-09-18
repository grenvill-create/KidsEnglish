import realTadpoleImg from '../assets/real_tadpole.jpg'
import realFrogImg from '../assets/real_frog.jpg'
import realToadImg from '../assets/real_toad.jpg'
import realWetImg from '../assets/real_wet.jpg'
import realBumpyImg from '../assets/real_bumpy.jpg'
import realBushesImg from '../assets/real_bushes.jpg'
import cuteFrogImg from '../assets/cute_little_frog.jpg'

import countingSheepCover from '../assets/counting_sheep_cover.jpg'
import readBooksBedImg from '../assets/read_books_bed.jpg'
import hugGoodNightImg from '../assets/hug_good_night.jpg'
import bedSoftCozyImg from '../assets/bed_soft_cozy.jpg'
import catSleepsBedImg from '../assets/cat_sleeps_bed.jpg'
import skyTurnedDarkImg from '../assets/sky_turned_dark.jpg'
import eyesCloseSleepImg from '../assets/eyes_close_sleep.jpg'

import sweetSentencesCover from '../assets/sweet_sentences_cover.jpg'
import realDoughnutsImg from '../assets/real_doughnuts.jpg'
import realSweetCandyImg from '../assets/real_sweet_candy.jpg'
import realChewingGumImg from '../assets/real_chewing_gum.jpg'
import realBakeryShopImg from '../assets/real_bakery_shop.jpg'
import realPartyImg from '../assets/real_party.jpg'
import realCircusImg from '../assets/real_circus.jpg'

export const REAL_IMAGES = {
  tadpole: realTadpoleImg,
  frog: realFrogImg,
  toad: realToadImg,
  wet: realWetImg,
  bumpy: realBumpyImg,
  bushes: realBushesImg,
  sheepCover: countingSheepCover,
  readBooks: readBooksBedImg,
  hugNight: hugGoodNightImg,
  bedCozy: bedSoftCozyImg,
  catSleeps: catSleepsBedImg,
  skyDark: skyTurnedDarkImg,
  eyesClose: eyesCloseSleepImg,
  sweetCover: sweetSentencesCover,
  doughnuts: realDoughnutsImg,
  candy: realSweetCandyImg,
  gum: realChewingGumImg,
  bakery: realBakeryShopImg,
  party: realPartyImg,
  circus: realCircusImg
}

export const CUTE_FROG_IMAGE = cuteFrogImg
export const COUNTING_SHEEP_COVER = countingSheepCover
export const SWEET_SENTENCES_COVER = sweetSentencesCover

// 星期五今日最新作业：Sweet Sentences 🍬 (三段式造句：人物 + 动作 + 地点/时间)
export const HOMEWORK_SWEET_SENTENCES = {
  id: 'homework-sweet-sentences',
  date: '2026年9月18日 星期五',
  childName: '',
  theme: 'sweet-sentences',
  
  // 1. 英语作业：Sweet Sentences: Writing 3-part sentences
  english: {
    title: 'Sweet Sentences: Writing 3-part sentences 🍬',
    topic: 'Writing 3-Part Sentences (三段式造句与句子结构分析)',
    teacherNote: 'FRIDAY: * Checked homework & Reading - Made provisions and corrections. * Practiced writing more and getting familiar with capitalization and punctuation. * Identified words with uppercase letters. * Maths: Flowers in a Pot - Matching maths dots with number words. * Practiced writing uppercase and lowercase letters of the alphabet. HOMEWORK: SWEET SENTENCES: Using 3-part sentences. On another writing page, name the three parts of this sentence: The doughnut shop closed at noon.',
    instruction: '从糖果表的三列中（naming part 人物、action 动作、where or when 地点或时间）各选一个词块，拼出3句美味香甜的完整句子！工整写在糖果线上，句首大写、句尾加句号。并分析找出 "The doughnut shop closed at noon." 的三部分！',
    ruleTips: [
      { id: 'r1', title: '🍬 3-Part 句型三段式', desc: '每一个完整的句子像美味糖果一样由三部分组成：1. Naming part（人物主语） 2. Action（谓语动作） 3. Where or When（地点或时间状语）！' },
      { id: 'r2', title: '🔠 句首首字母必须大写', desc: '句子开头的第一个单词必须大写（例如：I, She, He, The），像立正的小卫兵！' },
      { id: 'r3', title: '🔴 句末圆点句号不能忘', desc: '陈述句写完后，末尾必须点上一个小圆点句号 (.)！' },
      { id: 'r4', title: '🔍 句子三成分深度拆解', desc: 'The doughnut shop（主语主体/naming part）+ closed（动作/action）+ at noon（时间/when）！' }
    ],
    tableParts: {
      namingParts: [
        { id: 'np1', text: 'I', cn: '我', capital: 'I' },
        { id: 'np2', text: 'She', cn: '她', capital: 'She' },
        { id: 'np3', text: 'He', cn: '他', capital: 'He' }
      ],
      actions: [
        { id: 'act1', text: 'ate doughnuts', cn: '吃了甜甜圈', keyWord: 'doughnuts' },
        { id: 'act2', text: 'ate candy', cn: '吃了糖果', keyWord: 'candy' },
        { id: 'act3', text: 'chewed gum', cn: '嚼了泡泡糖', keyWord: 'gum' }
      ],
      whereOrWhen: [
        { id: 'ww1', text: 'at the bakery', cn: '在面包店', type: 'where', keyWord: 'bakery' },
        { id: 'ww2', text: 'at the party', cn: '在聚会上', type: 'where', keyWord: 'party' },
        { id: 'ww3', text: 'at the circus', cn: '在马戏团', type: 'where', keyWord: 'circus' }
      ]
    },
    sentences: [
      {
        id: 'sw1',
        num: 1,
        colorTheme: 'pink',
        colorName: '粉色糖果',
        candyEmoji: '🍬',
        namingPart: 'I',
        actionPart: 'ate doughnuts',
        whereWhenPart: 'at the bakery',
        raw: 'I ate doughnuts at the bakery.',
        corrected: 'I ate doughnuts at the bakery.',
        translation: '我在面包店里吃了甜甜圈。',
        capitalChar: 'I',
        rawFirstChar: 'I',
        hasPeriod: true,
        emoji: '🍩',
        image: realDoughnutsImg,
        subject: 'I (我) + ate doughnuts + at the bakery',
        keyWords: [
          { en: 'I', cn: '我' },
          { en: 'ate', cn: '吃了 (eat过去式)' },
          { en: 'doughnuts', cn: '甜甜圈' },
          { en: 'bakery', cn: '面包店' }
        ],
        scienceTip: '三段式拆解：[Naming part: I] + [Action: ate doughnuts] + [Where: at the bakery]！',
        pencilGuide: '第1题（粉色糖果纸）：在第一条横线上工整抄写 "I ate doughnuts at the bakery."，句首 "I" 大写，单词间空出一指宽，句末点上句号 "."。'
      },
      {
        id: 'sw2',
        num: 2,
        colorTheme: 'yellow',
        colorName: '黄色糖果',
        candyEmoji: '🍭',
        namingPart: 'She',
        actionPart: 'ate candy',
        whereWhenPart: 'at the party',
        raw: 'She ate candy at the party.',
        corrected: 'She ate candy at the party.',
        translation: '她在派对上吃了糖果。',
        capitalChar: 'S',
        rawFirstChar: 'S',
        hasPeriod: true,
        emoji: '🍬',
        image: realPartyImg,
        subject: 'She (她) + ate candy + at the party',
        keyWords: [
          { en: 'She', cn: '她' },
          { en: 'ate', cn: '吃了' },
          { en: 'candy', cn: '糖果' },
          { en: 'party', cn: '派对/聚会' }
        ],
        scienceTip: '三段式拆解：[Naming part: She] + [Action: ate candy] + [Where: at the party]！',
        pencilGuide: '第2题（黄色糖果纸）：在第二条横线上工整写下 "She ate candy at the party."，首字母 "S" 大写，句末画句号 "."。'
      },
      {
        id: 'sw3',
        num: 3,
        colorTheme: 'green',
        colorName: '绿色糖果',
        candyEmoji: '🫧',
        namingPart: 'He',
        actionPart: 'chewed gum',
        whereWhenPart: 'at the circus',
        raw: 'He chewed gum at the circus.',
        corrected: 'He chewed gum at the circus.',
        translation: '他在马戏团嚼了口香糖。',
        capitalChar: 'H',
        rawFirstChar: 'H',
        hasPeriod: true,
        emoji: '🎪',
        image: realCircusImg,
        subject: 'He (他) + chewed gum + at the circus',
        keyWords: [
          { en: 'He', cn: '他' },
          { en: 'chewed', cn: '嚼了 (chew过去式)' },
          { en: 'gum', cn: '口香糖/泡泡糖' },
          { en: 'circus', cn: '马戏团' }
        ],
        scienceTip: '三段式拆解：[Naming part: He] + [Action: chewed gum] + [Where: at the circus]！',
        pencilGuide: '第3题（绿色糖果纸）：在第三条横线上工整写下 "He chewed gum at the circus."，首字母 "H" 大写，句末画句号 "."。'
      }
    ],
    threePartAnalyzer: {
      targetSentence: 'The doughnut shop closed at noon.',
      translation: '这家甜甜圈店在中午十二点关门了。',
      prompt: 'On another writing page, name the three parts of this sentence: The doughnut shop closed at noon.',
      promptCn: '在另一张纸上，写出这个句子的三个组成部分：',
      parts: [
        {
          name: '1. Naming part (人物/主语主体)',
          answer: 'The doughnut shop',
          cn: '甜甜圈店 (全句讲的是谁/什么主体)',
          tag: 'Who or what',
          icon: '🏪'
        },
        {
          name: '2. Action (动作/谓语动词)',
          answer: 'closed',
          cn: '关门停业了 (发生了什么动作)',
          tag: 'What happened',
          icon: '🔒'
        },
        {
          name: '3. Where or when (地点或时间/状语)',
          answer: 'at noon',
          cn: '在正午十二点 (在什么时候/时间状语)',
          tag: 'When (时间)',
          icon: '🕛'
        }
      ]
    },
    words: [
      {
        id: 'sw-w1',
        word: 'doughnut',
        phonetic: '/ˈdoʊnʌt/',
        translation: '甜甜圈',
        emoji: '🍩',
        image: realDoughnutsImg,
        sentence: 'I ate sweet doughnuts at the bakery.',
        sentenceCn: '我在面包店吃了香甜的甜甜圈。'
      },
      {
        id: 'sw-w2',
        word: 'candy',
        phonetic: '/ˈkændi/',
        translation: '糖果',
        emoji: '🍬',
        image: realSweetCandyImg,
        sentence: 'She ate candy at the party.',
        sentenceCn: '她在聚会上吃了糖果。'
      },
      {
        id: 'sw-w3',
        word: 'gum',
        phonetic: '/ɡʌm/',
        translation: '口香糖 / 泡泡糖',
        emoji: '🫧',
        image: realChewingGumImg,
        sentence: 'He chewed gum and blew a big bubble.',
        sentenceCn: '他嚼了泡泡糖，吹了一个大大的泡泡。'
      },
      {
        id: 'sw-w4',
        word: 'bakery',
        phonetic: '/ˈbeɪkəri/',
        translation: '面包店 / 烘焙房',
        emoji: '🥖',
        image: realBakeryShopImg,
        sentence: 'The bakery smells like fresh bread.',
        sentenceCn: '面包店里飘着新鲜出炉面包的香味。'
      },
      {
        id: 'sw-w5',
        word: 'party',
        phonetic: '/ˈpɑːrti/',
        translation: '聚会 / 生日派对',
        emoji: '🎈',
        image: realPartyImg,
        sentence: 'We had lots of fun at the party.',
        sentenceCn: '我们在派对上玩得非常开心。'
      },
      {
        id: 'sw-w6',
        word: 'circus',
        phonetic: '/ˈsɜːrkəs/',
        translation: '马戏团 / 杂技大篷',
        emoji: '🎪',
        image: realCircusImg,
        sentence: 'We saw acrobats perform at the circus.',
        sentenceCn: '我们在马戏团看到了杂技演员的精彩表演。'
      }
    ],
    writingWorkshop: {
      title: '🍬 3-Part Sentences 糖果三段式拼词台',
      promptCn: '用糖果上的三部分（Naming part + Action + Where/When）自由组合出更多香甜的完整句子！',
      tips: [
        '第 1 步：挑选主语人物（Naming part）：谁在做事情？（I / She / He）',
        '第 2 步：挑选动作（Action）：做了什么事情？（ate doughnuts / ate candy / chewed gum）',
        '第 3 步：挑选地点或时间（Where or when）：在哪里或在何时？（at the bakery / at the party / at the circus）',
        '第 4 步：在纸上工整写下，句首大写，单词间留空，句末点上圆点句号！'
      ],
      samples: [
        {
          id: 'ss1',
          name: '🍬 糖果范例 1：我在面包店',
          lines: [
            { en: 'I ate doughnuts at the bakery.', cn: '我在面包店吃了甜甜圈。' },
            { en: 'The strawberry doughnuts were sweet and warm.', cn: '草莓甜甜圈又香甜又温暖。' },
            { en: 'I loved my visit to the bakery.', cn: '我很喜欢这次去面包店的美妙时光。' }
          ]
        },
        {
          id: 'ss2',
          name: '🍭 糖果范例 2：她在派对上',
          lines: [
            { en: 'She ate candy at the party.', cn: '她在派对上吃了糖果。' },
            { en: 'She shared colorful candies with her friends.', cn: '她和小伙伴们分享了五彩缤纷的糖果。' },
            { en: 'Everyone clapped and sang together.', cn: '大家一起拍手欢唱。' }
          ]
        },
        {
          id: 'ss3',
          name: '🎪 糖果范例 3：他在马戏团',
          lines: [
            { en: 'He chewed gum at the circus.', cn: '他在马戏团嚼了泡泡糖。' },
            { en: 'He blew a big round pink bubble.', cn: '他吹出了一个大大的粉色圆泡泡。' },
            { en: 'The funny clown smiled at him.', cn: '滑稽可爱的小丑朝他微笑了。' }
          ]
        }
      ],
      interactiveStarters: [
        {
          label: '🍬 糖果主语人物 (Naming part)',
          starters: ['I', 'She', 'He', 'The children', 'My friend', 'The baker']
        },
        {
          label: '⚡ 动作词汇 (Action)',
          starters: ['ate doughnuts', 'ate candy', 'chewed gum', 'bought fresh bread', 'drank sweet juice']
        },
        {
          label: '📍 地点与时间 (Where or when)',
          starters: ['at the bakery.', 'at the party.', 'at the circus.', 'at noon.', 'in the morning.', 'before dinner.']
        }
      ]
    }
  },

  // 2. 语文拼音复习
  pinyin: {
    teacherNote: 'FRIDAY 拼音与大小写字母练习：复习声母 g、k、h 拼读，规范 26 个英文字母大写与小写书写。',
    letters: [
      { id: 'p1', char: 'g', type: '声母', mnemonic: '9字加弯 g g g，白鸽飞舞 🕊️', soundTip: '舌根抵住软腭，突然放开' },
      { id: 'p2', char: 'k', type: '声母', mnemonic: '两只蝌蚪 k k k，清泉戏水 🟢', soundTip: '舌根抵住软腭，强力喷气' },
      { id: 'p3', char: 'h', type: '声母', mnemonic: '一把靠背椅 h h h，喝水解渴 🥤', soundTip: '舌根靠近软腭，气流摩擦而出' }
    ],
    blends: [
      { id: 'bl1', initial: 'g', final: 'āo', result: 'gāo', word: '蛋糕与甜甜圈 🍰', example: '蛋糕、高兴' },
      { id: 'bl2', initial: 'k', final: 'ě', result: 'kě', word: '可口的糖果 🍬', example: '可口、可爱' },
      { id: 'bl3', initial: 'h', final: 'uā', result: 'huā', word: '花盆里的花朵 🌸', example: '花朵、鲜花' }
    ]
  },

  // 3. 语文阅读指读
  reading: {
    title: '童谣《甜甜圈与糖果店》',
    author: '双语趣味儿歌',
    teacherNote: '朗读周五甜蜜童谣，在节奏中掌握 naming part、action 与 where or when！',
    image: sweetSentencesCover,
    lines: [
      [
        { char: '小', pinyin: 'xiǎo' }, { char: '朋', pinyin: 'péng' }, { char: '友', pinyin: 'you' }, { char: '，', pinyin: '' },
        { char: '去', pinyin: 'qù' }, { char: '糖', pinyin: 'táng' }, { char: '果', pinyin: 'guǒ' }, { char: '店', pinyin: 'diàn' }, { char: '。', pinyin: '' }
      ],
      [
        { char: '吃', pinyin: 'chī' }, { char: '个', pinyin: 'gè' }, { char: '圈', pinyin: 'quān' }, { char: '，', pinyin: '' },
        { char: '甜', pinyin: 'tián' }, { char: '又', pinyin: 'yòu' }, { char: '香', pinyin: 'xiāng' }, { char: '。', pinyin: '' }
      ],
      [
        { char: '吹', pinyin: 'chuī' }, { char: '泡', pinyin: 'pào' }, { char: '泡', pinyin: 'pao' }, { char: '，', pinyin: '' },
        { char: '圆', pinyin: 'yuán' }, { char: '又', pinyin: 'yòu' }, { char: '大', pinyin: 'dà' }, { char: '。', pinyin: '' }
      ],
      [
        { char: '做', pinyin: 'zuò' }, { char: '好', pinyin: 'hǎo' }, { char: '句', pinyin: 'jù' }, { char: '，', pinyin: '' },
        { char: '大', pinyin: 'dà' }, { char: '大', pinyin: 'dà' }, { char: '赞', pinyin: 'zàn' }, { char: '！', pinyin: '' }
      ]
    ]
  }
}

// 星期四作业：Counting Sheep 🐑 (句首单词规范首字母大写 + 睡前绘本抄写专区)
export const HOMEWORK_COUNTING_SHEEP = {
  id: 'homework-counting-sheep',
  date: '2026年9月17日 星期四',
  childName: '',
  theme: 'counting-sheep',
  
  // 1. 英语作业：Counting Sheep: Capitalizing sentence beginnings
  english: {
    title: 'Counting Sheep: Capitalizing sentence beginnings 🐑',
    topic: 'Capitalizing Sentence Beginnings (句首字母大写规范)',
    teacherNote: 'THURSDAY: * Checked homework & Reading - Made provisions and corrections. * Practice writing more and get familiar with capitalization and punctuation. * Identify words with uppercase letters - Count the words with uppercase letters and write them down. HOMEWORK: COUNTING SHEEP: Capitalizing sentence beginnings. Using the practice writing page, copy a sentence from your favorite bedtime book. Circle the capital letter at the beginning.',
    instruction: '将每只小绵羊身上的起始词首字母改写为大写（如 we read 变 We read），写在横线上组成完整的睡前句子！在睡前绘本抄写专区写下你最喜爱的句子，并圈出句首大写字母。',
    ruleTips: [
      { id: 'r1', title: '🐑 句首第一词必须大写', desc: '每一个英语句子的第一个单词的首字母必须大写（例如：we read 变 We read，then we 变 Then we）！' },
      { id: 'r2', title: '🛏️ 熟记睡前温馨好词', desc: 'read books（看绘本）, hug good night（晚安拥抱）, soft and cozy（柔软舒服）, sleeps with me（陪我睡觉）, has turned dark（夜色深沉）, eyes close（双眼合上）。' },
      { id: 'r3', title: '📖 睡前绘本抄写拓展', desc: '找一本最喜欢的睡前故事绘本（Bedtime book），在纸上工整抄写一句话，用彩色笔把句首第一个大写字母圈出来！' },
      { id: 'r4', title: '🔍 寻找大写字母大挑战', desc: '数一数作业纸上所有大写字母的数量，把它们端正记录下来。' }
    ],
    sentences: [
      {
        id: 'cs1',
        num: 1,
        sheepWords: 'we read',
        rawRest: 'books before bed.',
        raw: 'we read books before bed.',
        corrected: 'We read books before bed.',
        translation: '我们在睡前看书。',
        capitalWord: 'We read',
        capitalChar: 'W',
        rawFirstChar: 'w',
        hasPeriod: true,
        emoji: '📖',
        image: readBooksBedImg,
        subject: 'we read (睡前读书)',
        keyWords: [
          { en: 'we', cn: '我们' },
          { en: 'read', cn: '阅读/读书' },
          { en: 'books', cn: '书本/绘本' },
          { en: 'before', cn: '在……之前' },
          { en: 'bed', cn: '床/睡前' }
        ],
        scienceTip: '温馨睡前时光：在床头安静读一本温暖的绘本，能让大脑放松，进入甜甜梦乡。',
        pencilGuide: '作业纸第1题：小羊身上是小写 "we read"，写在横线上要把首字母 "w" 改写成大写 "W" -> "We read"，后面连接 "books before bed."'
      },
      {
        id: 'cs2',
        num: 2,
        sheepWords: 'then we',
        rawRest: 'hug good night.',
        raw: 'then we hug good night.',
        corrected: 'Then we hug good night.',
        translation: '然后我们拥抱说晚安。',
        capitalWord: 'Then we',
        capitalChar: 'T',
        rawFirstChar: 't',
        hasPeriod: true,
        emoji: '🫂',
        image: hugGoodNightImg,
        subject: 'then we (晚安拥抱)',
        keyWords: [
          { en: 'then', cn: '然后/接着' },
          { en: 'we', cn: '我们' },
          { en: 'hug', cn: '拥抱' },
          { en: 'good night', cn: '晚安' }
        ],
        scienceTip: '爱的拥抱：睡前和爸爸妈妈互相给一个大大的晚安拥抱，让人感到无比安心与幸福。',
        pencilGuide: '作业纸第2题：小羊身上的 "then we" 位于句首，首字母 "t" 必须改成大写 "T" -> "Then we hug good night."'
      },
      {
        id: 'cs3',
        num: 3,
        sheepWords: 'my bed',
        rawRest: 'is soft and cozy.',
        raw: 'my bed is soft and cozy.',
        corrected: 'My bed is soft and cozy.',
        translation: '我的小床又软又舒适。',
        capitalWord: 'My bed',
        capitalChar: 'M',
        rawFirstChar: 'm',
        hasPeriod: true,
        emoji: '🛏️',
        image: bedSoftCozyImg,
        subject: 'my bed (温馨小床)',
        keyWords: [
          { en: 'my', cn: '我的' },
          { en: 'bed', cn: '床' },
          { en: 'soft', cn: '柔软的' },
          { en: 'and', cn: '和/又……又……' },
          { en: 'cozy', cn: '舒服温馨的' }
        ],
        scienceTip: '舒适小窝：soft（柔软）和 cozy（舒适）是形容温暖被窝最好的词汇。',
        pencilGuide: '作业纸第3题：小羊身上的 "my bed" 是句首，首字母 "m" 必须大写成 "M" -> "My bed is soft and cozy."'
      },
      {
        id: 'cs4',
        num: 4,
        sheepWords: 'my cat',
        rawRest: 'sleeps with me.',
        raw: 'my cat sleeps with me.',
        corrected: 'My cat sleeps with me.',
        translation: '我的小猫和我一起睡觉。',
        capitalWord: 'My cat',
        capitalChar: 'M',
        rawFirstChar: 'm',
        hasPeriod: true,
        emoji: '🐱',
        image: catSleepsBedImg,
        subject: 'my cat (可爱小猫)',
        keyWords: [
          { en: 'my', cn: '我的' },
          { en: 'cat', cn: '小猫' },
          { en: 'sleeps', cn: '睡觉' },
          { en: 'with', cn: '和……一起' },
          { en: 'me', cn: '我' }
        ],
        scienceTip: '可爱睡伴：猫咪打呼噜的呼噜声（purring）能带来平静安详的助眠氛围。',
        pencilGuide: '作业纸第4题：小羊身上是 "my cat"，首字母 "m" 改成大写 "M" -> "My cat sleeps with me."'
      },
      {
        id: 'cs5',
        num: 5,
        sheepWords: 'the sky',
        rawRest: 'has turned dark.',
        raw: 'the sky has turned dark.',
        corrected: 'The sky has turned dark.',
        translation: '天空已经变暗变黑了。',
        capitalWord: 'The sky',
        capitalChar: 'T',
        rawFirstChar: 't',
        hasPeriod: true,
        emoji: '🌌',
        image: skyTurnedDarkImg,
        subject: 'the sky (夜幕降临)',
        keyWords: [
          { en: 'the', cn: '这/那 (定冠词)' },
          { en: 'sky', cn: '天空' },
          { en: 'has turned', cn: '已经转变成' },
          { en: 'dark', cn: '黑暗/天黑' }
        ],
        scienceTip: '昼夜规律：夜幕降临，天空中升起银色月亮和漫天繁星，该准备进入甜甜梦乡啦。',
        pencilGuide: '作业纸第5题：小羊身上是 "the sky"，句首 "t" 必须写成大写 "T" -> "The sky has turned dark."'
      },
      {
        id: 'cs6',
        num: 6,
        sheepWords: 'my eyes',
        rawRest: 'close.',
        raw: 'my eyes close.',
        corrected: 'My eyes close.',
        translation: '我的双眼轻轻闭上了。',
        capitalWord: 'My eyes',
        capitalChar: 'M',
        rawFirstChar: 'm',
        hasPeriod: true,
        emoji: '😴',
        image: eyesCloseSleepImg,
        subject: 'my eyes (甜美入梦)',
        keyWords: [
          { en: 'my', cn: '我的' },
          { en: 'eyes', cn: '双眼' },
          { en: 'close', cn: '闭上/合上' }
        ],
        scienceTip: '做个好梦：双眼合上，身体得到充分休息，明天醒来精力充沛！',
        pencilGuide: '作业纸第6题：小羊身上是 "my eyes"，首字母 "m" 大写成 "M" -> "My eyes close."'
      }
    ],
    words: [
      {
        id: 'csw1',
        word: 'sheep',
        phonetic: '/ʃiːp/',
        translation: '绵羊 / 睡前数羊',
        emoji: '🐑',
        image: countingSheepCover,
        sentence: 'Counting sheep helps children fall asleep.',
        sentenceCn: '数小绵羊能帮小朋友们安然入睡。'
      },
      {
        id: 'csw2',
        word: 'read',
        phonetic: '/riːd/',
        translation: '阅读 / 看绘本',
        emoji: '📖',
        image: readBooksBedImg,
        sentence: 'We read books before bed.',
        sentenceCn: '我们在睡前读书。'
      },
      {
        id: 'csw3',
        word: 'hug',
        phonetic: '/hʌɡ/',
        translation: '拥抱 / 晚安抱抱',
        emoji: '🫂',
        image: hugGoodNightImg,
        sentence: 'Then we hug good night.',
        sentenceCn: '然后我们拥抱说晚安。'
      },
      {
        id: 'csw4',
        word: 'cozy',
        phonetic: '/ˈkoʊzi/',
        translation: '温暖舒适惬意的',
        emoji: '🛏️',
        image: bedSoftCozyImg,
        sentence: 'My bed is soft and cozy.',
        sentenceCn: '我的小床又软又舒适。'
      },
      {
        id: 'csw5',
        word: 'sleep',
        phonetic: '/sliːp/',
        translation: '睡觉 / 甜美入梦',
        emoji: '🐱',
        image: catSleepsBedImg,
        sentence: 'My cat sleeps with me.',
        sentenceCn: '我的小猫和我一起睡觉。'
      },
      {
        id: 'csw6',
        word: 'dark',
        phonetic: '/dɑːrk/',
        translation: '黑暗的 / 夜幕天黑',
        emoji: '🌌',
        image: skyTurnedDarkImg,
        sentence: 'The sky has turned dark.',
        sentenceCn: '天空已经变黑了。'
      }
    ],
    writingWorkshop: {
      title: '📖 睡前绘本抄写专区 (Bedtime Book Copywork)',
      promptCn: 'On another piece of paper, copy a sentence from your favorite bedtime book. Circle the capital letter at the beginning. (在另一张纸上，从你最喜爱的睡前绘本中抄写一个句子，用彩笔圈出句首的大写字母！)',
      tips: [
        '挑一本最喜爱的睡前故事书（Bedtime book）',
        '在纸上工整抄写一个完整句子，单词间留出一个字母的空隙（finger space）',
        '拿出一支亮色笔，把句首第一个站得高高的大写字母（Capital Letter）画个大圆圈（Circle）圈出来！'
      ],
      samples: [
        {
          id: 'wb1',
          name: '🌙 经典晚安：《Goodnight Moon》',
          bookTitle: 'Goodnight Moon (晚安月亮)',
          capitalLetter: 'G',
          lines: [
            { en: 'Goodnight stars, goodnight air.', cn: '晚安星星，晚安空气。（圈出大写字母 G）' },
            { en: 'Goodnight noises everywhere.', cn: '晚安到处的声音。（圈出大写字母 G）' },
            { en: 'Sleep tight until the morning light.', cn: '安睡吧，直到晨光升起。（圈出大写字母 S）' }
          ]
        },
        {
          id: 'wb2',
          name: '🐰 爱的表达：《Guess How Much I Love You》',
          bookTitle: 'Guess How Much I Love You (猜猜我有多爱你)',
          capitalLetter: 'I',
          lines: [
            { en: 'I love you right up to the moon.', cn: '我爱你一直到月亮那么高。（圈出大写字母 I）' },
            { en: 'And back.', cn: '而且还再绕回来。（圈出大写字母 A）' },
            { en: 'Big Nutbrown Hare smiled and fell asleep.', cn: '大栗色野兔微笑着睡着了。（圈出大写字母 B）' }
          ]
        },
        {
          id: 'wb3',
          name: '🐛 神奇自然：《The Very Hungry Caterpillar》',
          bookTitle: 'The Very Hungry Caterpillar (好饿的毛毛虫)',
          capitalLetter: 'I',
          lines: [
            { en: 'In the light of the moon, a little egg lay on a leaf.', cn: '在月光下，一颗小小的卵正躺在叶子上。（圈出大写字母 I）' },
            { en: 'One Sunday morning the warm sun came up.', cn: '一个星期天早晨，暖洋洋的太阳升起来了。（圈出大写字母 O）' },
            { en: 'He started to look for some food.', cn: '他开始寻找好吃的食物。（圈出大写字母 H）' }
          ]
        }
      ],
      interactiveStarters: [
        {
          label: '🌟 睡前绘本经典句首（首字母大写并画圈）',
          starters: ['In the night,', 'Once upon a time,', 'Goodnight moon,', 'I love you,', 'When night comes,', 'The little stars']
        },
        {
          label: '🛏️ 睡前温馨短语',
          starters: ['before bed.', 'soft and cozy.', 'sleeps peacefully.', 'has turned dark.', 'close my eyes.', 'hug mommy and daddy.']
        }
      ]
    }
  },

  // 2. 语文拼音复习
  pinyin: {
    teacherNote: 'THURSDAY 拼音与书写复习：规范书写坐姿与大写英文字母对应关系，巩固声母拼读。',
    letters: [
      { id: 'p1', char: 'd', type: '声母', mnemonic: '左下半圆 d d d，马儿奔跑 🐎', soundTip: '舌尖抵住上齿龈，突然放开' },
      { id: 'p2', char: 't', type: '声母', mnemonic: '一把伞柄 t t t，下雨撑伞 ☔', soundTip: '舌尖抵住上齿龈，强力喷气' },
      { id: 'p3', char: 'n', type: '声母', mnemonic: '一个门洞 n n n，小哪吒 🧒', soundTip: '舌尖抵住上齿龈，鼻腔出气' },
      { id: 'p4', char: 'l', type: '声母', mnemonic: '一根小棒 l l l，小铅笔 ✏️', soundTip: '舌尖抵住上齿龈，气流从两边流出' }
    ],
    blends: [
      { id: 'bl1', initial: 'd', final: 'à', result: 'dà', word: '大写字母 / 大象 🐘', example: '大门、大写' },
      { id: 'bl2', initial: 't', final: 'iān', result: 'tiān', word: '白天与黑夜 🌌', example: '天空、天黑' },
      { id: 'bl3', initial: 'n', final: 'ǎi', result: 'nǎi', word: '睡前喝牛奶 🥛', example: '牛奶、奶奶' },
      { id: 'bl4', initial: 'l', final: 'iù', result: 'liù', word: '数六只小羊 🐑', example: '数字 6 (六)' }
    ]
  },

  // 3. 语文阅读指读
  reading: {
    title: '睡前童谣《数小羊》',
    author: '经典儿童晚安童谣',
    teacherNote: '睡前读一读温暖的《数小羊》，一只小羊跳过栅栏，做个香甜的美梦。',
    image: countingSheepCover,
    lines: [
      [
        { char: '一', pinyin: 'yī' }, { char: '只', pinyin: 'zhī' }, { char: '羊', pinyin: 'yáng' }, { char: '，', pinyin: '' },
        { char: '跳', pinyin: 'tiào' }, { char: '过', pinyin: 'guò' }, { char: '墙', pinyin: 'qiáng' }, { char: '。', pinyin: '' }
      ],
      [
        { char: '两', pinyin: 'liǎng' }, { char: '只', pinyin: 'zhī' }, { char: '羊', pinyin: 'yáng' }, { char: '，', pinyin: '' },
        { char: '捉', pinyin: 'zhuō' }, { char: '迷', pinyin: 'mí' }, { char: '藏', pinyin: 'cáng' }, { char: '。', pinyin: '' }
      ],
      [
        { char: '三', pinyin: 'sān' }, { char: '只', pinyin: 'zhī' }, { char: '羊', pinyin: 'yáng' }, { char: '，', pinyin: '' },
        { char: '闭', pinyin: 'bì' }, { char: '眼', pinyin: 'yǎn' }, { char: '睛', pinyin: 'jing' }, { char: '。', pinyin: '' }
      ],
      [
        { char: '钻', pinyin: 'zuān' }, { char: '进', pinyin: 'jìn' }, { char: '被', pinyin: 'bèi' }, { char: '窝', pinyin: 'wō' },
        { char: '梦', pinyin: 'mèng' }, { char: '甜', pinyin: 'tián' }, { char: '香', pinyin: 'xiāng' }, { char: '。', pinyin: '' }
      ]
    ]
  }
}

// 往期作业：2026年9月16日 星期三 Hop to It Some More! 🐸 (青蛙与蟾蜍)
export const HOMEWORK_2026_09_16 = {
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
        image: realTadpoleImg,
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
        image: realFrogImg,
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
        image: realBushesImg,
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
        image: realWetImg,
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
        image: realBumpyImg,
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
        image: realTadpoleImg,
        sentence: 'Tadpoles become frogs or toads.',
        sentenceCn: '蝌蚪会长成青蛙或蟾蜍。'
      },
      {
        id: 'fw2',
        word: 'frog',
        phonetic: '/frɔːɡ/',
        translation: '青蛙',
        emoji: '🐸',
        image: realFrogImg,
        sentence: 'Frogs live near water and love swimming.',
        sentenceCn: '青蛙生活在水边，热爱游泳。'
      },
      {
        id: 'fw3',
        word: 'toad',
        phonetic: '/toʊd/',
        translation: '蟾蜍 (癞蛤蟆)',
        emoji: '🪨',
        image: realToadImg,
        sentence: 'Toads live under bushes on land.',
        sentenceCn: '蟾蜍生活在陆地的灌木丛下。'
      },
      {
        id: 'fw4',
        word: 'wet',
        phonetic: '/wet/',
        translation: '湿润光滑的',
        emoji: '💧',
        image: realWetImg,
        sentence: 'Frogs have wet and smooth skin.',
        sentenceCn: '青蛙有着湿润光滑的皮肤。'
      },
      {
        id: 'fw5',
        word: 'bumpy',
        phonetic: '/ˈbʌmpi/',
        translation: '凹凸不平的 (疙瘩的)',
        emoji: '🪵',
        image: realBumpyImg,
        sentence: 'Toads have bumpy skin.',
        sentenceCn: '蟾蜍有着凹凸不平的粗糙皮肤。'
      },
      {
        id: 'fw6',
        word: 'bushes',
        phonetic: '/ˈbʊʃɪz/',
        translation: '灌木丛',
        emoji: '🌿',
        image: realBushesImg,
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

// 今日最新默认作业为星期五：Sweet Sentences
export const DEFAULT_HOMEWORK = HOMEWORK_SWEET_SENTENCES

// 历史作业归档列表库（支持按日期翻阅与周末复习）
export const DEFAULT_HOMEWORK_LIST = [
  HOMEWORK_SWEET_SENTENCES,
  HOMEWORK_COUNTING_SHEEP,
  HOMEWORK_2026_09_16,
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
