// 英语儿童作业词典数据库：支持所有作业单词点击即查（发音、国际音标、中文释义、英文释义、例句与语法小秘诀）

export const WORD_DICTIONARY = {
  // === 0. 星期五：糖果三段式造句核心词汇 (Sweet Sentences: 3-part sentences) ===
  'doughnut': {
    word: 'doughnut',
    displayWord: 'doughnut / donut (复数: doughnuts)',
    phonetic: '/ˈdoʊnʌt/',
    pos: 'n. 名词 (复数: doughnuts)',
    cn: '甜甜圈，油炸圈饼',
    en: 'A small sweet ring-shaped cake made of fried dough, often glazed with chocolate or sprinkles.',
    emoji: '🍩',
    exampleEn: 'I ate doughnuts at the bakery.',
    exampleCn: '我在面包店吃了甜甜圈。',
    tip: '💡 拼写提示：美式英语经常简写为 donut，英式标准拼写为 doughnut。'
  },
  'doughnuts': {
    word: 'doughnuts',
    displayWord: 'doughnuts (复数)',
    phonetic: '/ˈdoʊnʌts/',
    pos: 'n. 名词 (doughnut 的复数)',
    cn: '许多甜甜圈',
    en: 'More than one doughnut.',
    emoji: '🍩',
    exampleEn: 'The bakery has delicious strawberry doughnuts.',
    exampleCn: '这家面包店有香甜的草莓甜甜圈。',
    tip: '💡 单数一个用 a doughnut，复数多个用 doughnuts。'
  },
  'candy': {
    word: 'candy',
    displayWord: 'candy (复数: candies)',
    phonetic: '/ˈkændi/',
    pos: 'n. 名词 (美式常用)',
    cn: '糖果，甜食',
    en: 'A sweet food made with sugar or syrup, flavored with fruit or chocolate.',
    emoji: '🍬',
    exampleEn: 'She ate candy at the party.',
    exampleCn: '她在聚会上吃了糖果。',
    tip: '💡 英美差异：美式英语用 candy，英式英语常用 sweets。吃完糖要记得刷牙漱口哦！'
  },
  'gum': {
    word: 'gum',
    displayWord: 'gum / chewing gum',
    phonetic: '/ɡʌm/',
    pos: 'n. 名词 (口香糖 / 泡泡糖)',
    cn: '口香糖，泡泡糖；牙龈',
    en: 'A sweet flavored candy that you chew on for a long time and do not swallow.',
    emoji: '🫧',
    exampleEn: 'He chewed gum at the circus.',
    exampleCn: '他在马戏团嚼了泡泡糖。',
    tip: '💡 用法提示：chew gum 是固定搭配，表示“嚼口香糖”。泡泡糖是 bubble gum！'
  },
  'chew': {
    word: 'chew',
    displayWord: 'chew (过去式: chewed)',
    phonetic: '/tʃuː/',
    pos: 'v. 动词',
    cn: '咀嚼，细嚼',
    en: 'To bite and grind food with teeth in your mouth.',
    emoji: '🦷',
    exampleEn: 'Chew your food slowly before swallowing.',
    exampleCn: '咽下去之前要慢慢咀嚼食物哦。',
    tip: '💡 动作搭配：chewed gum（嚼了口香糖），过去式规则变化直接加 -ed。'
  },
  'chewed': {
    word: 'chewed',
    displayWord: 'chewed (动词过去式)',
    phonetic: '/tʃuːd/',
    pos: 'v. 动词 (chew 的过去式)',
    cn: '嚼了，咀嚼了',
    en: 'Past tense of chew.',
    emoji: '🦷',
    exampleEn: 'He chewed gum at the circus.',
    exampleCn: '他在马戏团里嚼了口香糖。',
    tip: '💡 发音要点：末尾 -ed 发浊辅音 /d/，整体读作 /tʃuːd/。'
  },
  'bakery': {
    word: 'bakery',
    displayWord: 'bakery',
    phonetic: '/ˈbeɪkəri/',
    pos: 'n. 名词 (复数: bakeries)',
    cn: '面包店，西饼屋，烘焙坊',
    en: 'A shop where fresh bread, cakes, doughnuts, and cookies are baked and sold.',
    emoji: '🥖',
    exampleEn: 'The smell of fresh bread came from the bakery.',
    exampleCn: '面包店里飘来刚出炉面包的诱人香味。',
    tip: '💡 构词小魔术：bake（烘烤）+ -ry（场所）= bakery（烘烤的地方/面包店）。'
  },
  'party': {
    word: 'party',
    displayWord: 'party (复数: parties)',
    phonetic: '/ˈpɑːrti/',
    pos: 'n. 名词',
    cn: '聚会，派对',
    en: 'A social gathering of friends to celebrate, play games, and have fun.',
    emoji: '🎈',
    exampleEn: 'We played games at the birthday party.',
    exampleCn: '我们在生日派对上玩了有趣的游戏。',
    tip: '💡 地点介词：at the party（在派对上）。'
  },
  'circus': {
    word: 'circus',
    displayWord: 'circus',
    phonetic: '/ˈsɜːrkəs/',
    pos: 'n. 名词',
    cn: '马戏团，杂技场',
    en: 'A traveling show with acrobats, clowns, and animals performed in a large tent.',
    emoji: '🎪',
    exampleEn: 'The clowns were so funny at the circus!',
    exampleCn: '马戏团里的小丑太滑稽可爱了！',
    tip: '💡 地点介词：at the circus（在马戏团里观看表演）。'
  },
  'noon': {
    word: 'noon',
    displayWord: 'noon (正午)',
    phonetic: '/nuːn/',
    pos: 'n. 名词',
    cn: '正午，中午十二点',
    en: 'Twelve o’clock in the middle of the day; midday.',
    emoji: '🕛',
    exampleEn: 'The doughnut shop closed at noon.',
    exampleCn: '这家甜甜圈店在中午十二点关门了。',
    tip: '💡 语法时间：at noon 表示“在正午”。反义词是 midnight（午夜）。'
  },
  'shop': {
    word: 'shop',
    displayWord: 'shop',
    phonetic: '/ʃɑːp/',
    pos: 'n. 名词 & v. 动词',
    cn: '商店，店铺；购物',
    en: 'A building or room where goods or services are sold.',
    emoji: '🏪',
    exampleEn: 'Let’s go to the doughnut shop.',
    exampleCn: '我们一起去甜甜圈店吧。',
    tip: '💡 复合名词：doughnut shop（甜甜圈店），toy shop（玩具店），bookshop（书店）。'
  },
  'closed': {
    word: 'closed',
    displayWord: 'closed (过去式/形容词)',
    phonetic: '/kloʊzd/',
    pos: 'adj. 关门的 / v. 关上了 (close 过去式)',
    cn: '关门的，停止营业的；关上了',
    en: 'Not open for business; having been shut.',
    emoji: '🔒',
    exampleEn: 'The museum is closed on Mondays.',
    exampleCn: '博物馆每逢周一闭馆。',
    tip: '💡 辨析：The shop is open（开门营业） vs The shop is closed（关门停业）。'
  },
  'part': {
    word: 'part',
    displayWord: 'part (三段式造句)',
    phonetic: '/pɑːrt/',
    pos: 'n. 名词',
    cn: '部分，部件',
    en: 'One of the sections or pieces that together make up a whole thing.',
    emoji: '🧩',
    exampleEn: 'A complete sentence has three parts: naming part, action, and where or when.',
    exampleCn: '一个完整的句子包含三个部分：人物、动作、地点或时间。',
    tip: '💡 本周核心语法：3-part sentences（三段式造句法），像拼拼图一样造句！'
  },
  'sweet': {
    word: 'sweet',
    displayWord: 'sweet',
    phonetic: '/swiːt/',
    pos: 'adj. 甜美的，香甜的 / n. 糖果',
    cn: '甜的，香甜的，美好的',
    en: 'Tasting like sugar or honey; pleasant and lovely.',
    emoji: '🍭',
    exampleEn: 'Have a sweet dream tonight!',
    exampleCn: '今晚做个香甜的美梦吧！',
    tip: '💡 Sweet Sentences：用甜甜的糖果组合出香甜美味的完整好句子！'
  },
  'ate': {
    word: 'ate',
    displayWord: 'ate (动词过去式)',
    phonetic: '/eɪt/',
    pos: 'v. 动词 (eat 的过去式)',
    cn: '吃了 (已经吃完)',
    en: 'Past tense of eat.',
    emoji: '😋',
    exampleEn: 'I ate doughnuts at the bakery.',
    exampleCn: '我在面包店吃了甜甜圈。',
    tip: '💡 语法不规则变化：eat（吃）的过去式是 ate（读音同数字 eight /eɪt/）。'
  },

  // === 1. 星期四：数羊与睡前句型作业核心词汇 (Counting Sheep) ===
  'sheep': {
    word: 'sheep',
    displayWord: 'sheep (单复数同形)',
    phonetic: '/ʃiːp/',
    pos: 'n. 名词 (单复数同形: one sheep, two sheep)',
    cn: '绵羊 (数绵羊助眠)',
    en: 'A fluffy animal with thick wool that says baa. People count sheep to help them fall asleep.',
    emoji: '🐑',
    exampleEn: 'One sheep, two sheep, three sheep jumping over the fence.',
    exampleCn: '一只羊，两只羊，三只羊跳过栅栏。',
    tip: '💡 语法常识：sheep 的单数和复数拼写完全相同，千万不要在后面加 s 变成 sheeps 哦！'
  },
  'count': {
    word: 'count',
    displayWord: 'count',
    phonetic: '/kaʊnt/',
    pos: 'v. 动词',
    cn: '数数，计算',
    en: 'To name numbers in order, one by one.',
    emoji: '🔢',
    exampleEn: 'Can you count from 1 to 10?',
    exampleCn: '你能从1数到10吗？',
    tip: '💡 睡前数羊（Counting Sheep）是欧美小朋友最经典的助眠小游戏。'
  },
  'read': {
    word: 'read',
    displayWord: 'read',
    phonetic: '/riːd/',
    pos: 'v. 动词 (过去式 read 读音为 /red/)',
    cn: '读，阅读',
    en: 'To look at written words and understand their meaning.',
    emoji: '📖',
    exampleEn: 'We read books before bed.',
    exampleCn: '我们在睡前读书。',
    tip: '💡 自然拼读：ea 发长元音 /iː/。睡前读绘本能让我们心神宁静。'
  },
  'hug': {
    word: 'hug',
    displayWord: 'hug',
    phonetic: '/hʌɡ/',
    pos: 'v. 动词 & n. 名词',
    cn: '拥抱，搂抱',
    en: 'To put your arms around someone closely to show love, warmth, and care.',
    emoji: '🫂',
    exampleEn: 'Then we hug good night.',
    exampleCn: '然后我们拥抱说晚安。',
    tip: '💡 爱的表达：Give Mommy and Daddy a big hug before sleeping!'
  },
  'bed': {
    word: 'bed',
    displayWord: 'bed',
    phonetic: '/bed/',
    pos: 'n. 名词',
    cn: '床，睡觉的地方',
    en: 'A comfortable piece of furniture used for sleeping or resting.',
    emoji: '🛏️',
    exampleEn: 'My bed is soft and cozy.',
    exampleCn: '我的小床又软又舒服。',
    tip: '💡 常用固定短语：before bed（睡前）, go to bed（上床睡觉）。'
  },
  'cozy': {
    word: 'cozy',
    displayWord: 'cozy (英式亦作 cosy)',
    phonetic: '/ˈkoʊzi/',
    pos: 'adj. 形容词',
    cn: '温暖舒适的，温馨惬意的',
    en: 'Warm, comfortable, and feeling safe and relaxed.',
    emoji: '☕',
    exampleEn: 'Our house feels warm and cozy in winter.',
    exampleCn: '冬天我们家里感觉格外温暖惬意。',
    tip: '💡 宝贝的被窝（soft and cozy bed）就像温暖的怀抱一样让人放松。'
  },
  'soft': {
    word: 'soft',
    displayWord: 'soft',
    phonetic: '/sɔːft/',
    pos: 'adj. 形容词',
    cn: '柔软的，软和的',
    en: 'Pleasant to touch, easy to press down, not hard or rough.',
    emoji: '🧸',
    exampleEn: 'The fluffy pillow is very soft.',
    exampleCn: '这个毛茸茸的枕头非常柔软。',
    tip: '💡 反义词是 hard（坚硬的）。羊毛（wool）和羽绒（down）都是 soft 的。'
  },
  'cat': {
    word: 'cat',
    displayWord: 'cat',
    phonetic: '/kæt/',
    pos: 'n. 名词',
    cn: '小猫',
    en: 'A small furry pet that purrs softly when happy.',
    emoji: '🐱',
    exampleEn: 'My cat sleeps with me on the bed.',
    exampleCn: '我的小猫和我一起在床上睡觉。',
    tip: '💡 基础自然拼读：/k/ - /æ/ - /t/ -> cat！'
  },
  'sleep': {
    word: 'sleep',
    displayWord: 'sleep / sleeps',
    phonetic: '/sliːp/',
    pos: 'v. 动词 & n. 名词',
    cn: '睡觉，睡眠',
    en: 'To rest with eyes closed while body and mind recharge.',
    emoji: '😴',
    exampleEn: 'Babies need plenty of good sleep.',
    exampleCn: '小宝宝们需要充足的好睡眠。',
    tip: '💡 第三人称单数加 s：My cat sleeps with me. 主语是单数 cat，动词用 sleeps。'
  },
  'sky': {
    word: 'sky',
    displayWord: 'sky',
    phonetic: '/skaɪ/',
    pos: 'n. 名词',
    cn: '天空',
    en: 'The expanse of air over the Earth where stars, clouds, and the moon appear.',
    emoji: '🌌',
    exampleEn: 'The sky has turned dark.',
    exampleCn: '天空已经变暗变黑了。',
    tip: '💡 字母 y 发双元音 /aɪ/。白天是 blue sky，夜晚是 dark starry sky。'
  },
  'dark': {
    word: 'dark',
    displayWord: 'dark',
    phonetic: '/dɑːrk/',
    pos: 'adj. 形容词 & n. 名词',
    cn: '黑暗的，深色的，黑夜',
    en: 'Having no light or very little light; night-time.',
    emoji: '🌙',
    exampleEn: 'It is dark outside, turn on the night lamp.',
    exampleCn: '外面天黑了，把小夜灯打开吧。',
    tip: '💡 反义词是 bright（明亮的）或 light（光亮）。'
  },
  'turn': {
    word: 'turn',
    displayWord: 'turn / turned',
    phonetic: '/tɜːrn/',
    pos: 'v. 动词 (过去式/过去分词: turned)',
    cn: '变成，转变成；转动',
    en: 'To become or change into a different state.',
    emoji: '🔄',
    exampleEn: 'Leaves turn yellow in autumn.',
    exampleCn: '秋天树叶会变黄。The sky has turned dark（天空变黑了）。',
    tip: '💡 句型拓展：has turned dark 是现在完成时，表示天空已经变成了黑夜的状态。'
  },
  'eye': {
    word: 'eye',
    displayWord: 'eye / eyes',
    phonetic: '/aɪ/',
    pos: 'n. 名词 (复数: eyes /aɪz/)',
    cn: '眼睛 (复数: 双眼)',
    en: 'The parts of your body that you use to see the world.',
    emoji: '👀',
    exampleEn: 'My eyes close gently.',
    exampleCn: '我的双眼轻轻闭上了。',
    tip: '💡 宝贝有两只眼睛，所以一般用复数 eyes 读 /aɪz/。'
  },
  'eyes': {
    word: 'eyes',
    displayWord: 'eyes',
    phonetic: '/aɪz/',
    pos: 'n. 名词 (eye 的复数形式)',
    cn: '双眼，双目',
    en: 'Both eyes together.',
    emoji: '👀',
    exampleEn: 'Close your eyes and sweet dreams!',
    exampleCn: '闭上你的眼睛，祝你好梦！',
    tip: '💡 句子主语为复数 eyes 时，动词用原形 close（不加 s）。'
  },
  'close': {
    word: 'close',
    displayWord: 'close',
    phonetic: '/kloʊz/',
    pos: 'v. 动词 (反义词: open)',
    cn: '闭上，合上，关上',
    en: 'To shut something, like your eyes, a door, or a book.',
    emoji: '🚪',
    exampleEn: 'Close your eyes and listen to the music.',
    exampleCn: '闭上眼睛，听听音乐吧。',
    tip: '💡 注意读音：作动词“关/闭”读 /kloʊz/（末尾浊音 z）；作形容词“亲近的”读 /kloʊs/（清音 s）。'
  },
  'bedtime': {
    word: 'bedtime',
    displayWord: 'bedtime',
    phonetic: '/ˈbedtaɪm/',
    pos: 'n. 名词',
    cn: '就寝时间，睡前时刻',
    en: 'The time at which one usually goes to bed.',
    emoji: '⏰',
    exampleEn: 'Bedtime stories are full of magic.',
    exampleCn: '睡前故事总是充满神奇的魔力。',
    tip: '💡 复合词：bed（床）+ time（时间）= bedtime（睡前时间）。'
  },
  'capital': {
    word: 'capital',
    displayWord: 'capital',
    phonetic: '/ˈkæpɪtl/',
    pos: 'adj. 大写的 / n. 大写字母',
    cn: '大写字母，首字母大写的',
    en: 'An uppercase letter like A, B, C used at the beginning of sentences.',
    emoji: '🔤',
    exampleEn: 'Every English sentence begins with a capital letter.',
    exampleCn: '每一个英语句子都必须以大写字母开头。',
    tip: '💡 本次作业核心规则：句首单词的首字母必须像大将军一样站得高高的大写（Capitalize）！'
  },
  'circle': {
    word: 'circle',
    displayWord: 'circle',
    phonetic: '/ˈsɜːrkl/',
    pos: 'v. 圈出，画圈 / n. 圆圈',
    cn: '圈出，画圆圈',
    en: 'To draw a round ring around a word or letter.',
    emoji: '⭕',
    exampleEn: 'Circle the capital letter at the beginning.',
    exampleCn: '圈出句首的大写字母。',
    tip: '💡 练习指令：Circle（圈出），Underline（下划线），Check（打勾）。'
  },
  'favorite': {
    word: 'favorite',
    displayWord: 'favorite (英式: favourite)',
    phonetic: '/ˈfeɪvərɪt/',
    pos: 'adj. 最喜爱的 / n. 最喜爱的人或物',
    cn: '最喜爱的，特别偏爱的',
    en: 'Best liked above all others.',
    emoji: '💖',
    exampleEn: 'What is your favorite bedtime book?',
    exampleCn: '你最喜欢的睡前绘本是哪一本呀？',
    tip: '💡 句型表达：My favorite book is ...（我最喜爱的书是……）。'
  },

  // === 1. 青蛙与蟾蜍作业核心词汇 (Hop to It Some More) ===
  'tadpole': {
    word: 'tadpole',
    displayWord: 'tadpole / tadpoles',
    phonetic: '/ˈtædpoʊl/',
    pos: 'n. 名词 (复数: tadpoles)',
    cn: '小蝌蚪 (蛙或蟾蜍的幼体)',
    en: 'A baby frog or toad that has a long tail and lives in water.',
    emoji: '🟢',
    exampleEn: 'Tadpoles swim fast in the cool pond.',
    exampleCn: '小蝌蚪在凉爽的池塘里飞快地游来游去。',
    tip: '💡 科学常识：小蝌蚪先长出两条后腿，再长出前腿，最后尾巴变短消失变成青蛙！'
  },
  'become': {
    word: 'become',
    displayWord: 'become',
    phonetic: '/bɪˈkʌm/',
    pos: 'v. 动词 (过去式: became)',
    cn: '变成，成长为',
    en: 'To grow, change, or turn into something new.',
    emoji: '🪄',
    exampleEn: 'Caterpillars become butterflies.',
    exampleCn: '毛毛虫会变成美丽的蝴蝶。',
    tip: '💡 用法：become + 名词/形容词，表示状态的转变。'
  },
  'frog': {
    word: 'frog',
    displayWord: 'frog / frogs',
    phonetic: '/frɔːɡ/',
    pos: 'n. 名词 (复数: frogs)',
    cn: '青蛙 (两栖动物)',
    en: 'A small leaping amphibian with smooth, wet skin and webbed feet.',
    emoji: '🐸',
    exampleEn: 'A green frog is sitting on a big lily pad.',
    exampleCn: '一只绿色的青蛙正坐在大荷叶上。',
    tip: '💡 记忆点：frog 是生活在水边的绿青蛙，皮肤湿润光滑，擅长游泳和大跳跃。'
  },
  'toad': {
    word: 'toad',
    displayWord: 'toad / toads',
    phonetic: '/toʊd/',
    pos: 'n. 名词 (复数: toads)',
    cn: '蟾蜍，癞蛤蟆',
    en: 'An amphibian that looks like a frog but has drier, bumpy skin and lives mostly on land.',
    emoji: '🪨',
    exampleEn: 'The brown toad is hiding under the bushes.',
    exampleCn: '那只棕色的蟾蜍正躲在灌木丛下面。',
    tip: '💡 区别：toad（蟾蜍）皮肤干燥布满小疙瘩（bumpy），多在陆地灌木草丛中生活。'
  },
  'or': {
    word: 'or',
    displayWord: 'or',
    phonetic: '/ɔːr/',
    pos: 'conj. 连词',
    cn: '或者，还是',
    en: 'Used to link two or more alternatives or choices.',
    emoji: '🔀',
    exampleEn: 'Do you want apples or bananas?',
    exampleCn: '你想要苹果还是香蕉？',
    tip: '💡 用法：连接两个并列的选择。'
  },
  'live': {
    word: 'live',
    displayWord: 'live',
    phonetic: '/lɪv/',
    pos: 'v. 动词 (第三人称单数: lives)',
    cn: '居住，生活',
    en: 'To have one’s home in a specific place.',
    emoji: '🏡',
    exampleEn: 'Fishes live in the water.',
    exampleCn: '鱼儿生活在水里面。',
    tip: '💡 注意读音：作动词“居住”读 /lɪv/；作形容词“现场的/活的”读 /laɪv/。'
  },
  'near': {
    word: 'near',
    displayWord: 'near',
    phonetic: '/nɪr/',
    pos: 'prep. 介词 / adj. 形容词',
    cn: '在……附近，靠近',
    en: 'At or to a short distance away; close to.',
    emoji: '📍',
    exampleEn: 'Frogs live near water.',
    exampleCn: '青蛙生活在水边附近。',
    tip: '💡 反义词是 far（遥远）。near the park（在公园附近）。'
  },
  'water': {
    word: 'water',
    displayWord: 'water',
    phonetic: '/ˈwɔːtər/',
    pos: 'n. 不可数名词',
    cn: '水，水边',
    en: 'The clear liquid that has no color or taste, found in lakes, ponds, and rivers.',
    emoji: '💧',
    exampleEn: 'Drink plenty of water every day.',
    exampleCn: '每天都要多多喝水哦。',
    tip: '💡 水是生命之源，frog 和 tadpole 都离不开 water。'
  },
  'under': {
    word: 'under',
    displayWord: 'under',
    phonetic: '/ˈʌndər/',
    pos: 'prep. 介词',
    cn: '在……正下方，在……底下',
    en: 'Below the surface of something; beneath.',
    emoji: '👇',
    exampleEn: 'The cat is sleeping under the table.',
    exampleCn: '小猫正在桌子底下睡觉。',
    tip: '💡 反义词是 on（在……上面）或 above。'
  },
  'bush': {
    word: 'bush',
    displayWord: 'bush / bushes',
    phonetic: '/bʊʃ/',
    pos: 'n. 名词 (复数: bushes)',
    cn: '灌木丛，矮树丛',
    en: 'A plant with many woody stems and green leaves, shorter than a tree.',
    emoji: '🌿',
    exampleEn: 'Toads love to hide under green bushes.',
    exampleCn: '蟾蜍喜欢躲在绿色的灌木丛下。',
    tip: '💡 单数以 sh 结尾，复数要加 es 变成 bushes [ˈbʊʃɪz]。'
  },
  'have': {
    word: 'have',
    displayWord: 'have / has',
    phonetic: '/hæv/',
    pos: 'v. 动词 (第三人称单数: has)',
    cn: '拥有，具有',
    en: 'To own, hold, or possess something as a feature.',
    emoji: '🤲',
    exampleEn: 'Frogs have long tongues.',
    exampleCn: '青蛙长着长长的舌头。',
    tip: '💡 主语是复数（Frogs / Toads）时用 have；单数（A frog）用 has。'
  },
  'wet': {
    word: 'wet',
    displayWord: 'wet',
    phonetic: '/wet/',
    pos: 'adj. 形容词',
    cn: '湿润的，潮湿光滑的',
    en: 'Covered or soaked with water or another liquid; not dry.',
    emoji: '💦',
    exampleEn: 'Frogs have wet skin.',
    exampleCn: '青蛙有着湿润的皮肤。',
    tip: '💡 反义词是 dry（干燥的）。青蛙的皮肤湿润才能帮助呼吸。'
  },
  'skin': {
    word: 'skin',
    displayWord: 'skin',
    phonetic: '/skɪn/',
    pos: 'n. 名词',
    cn: '皮肤 (身体外表层)',
    en: 'The thin layer of tissue forming the natural outer covering of the body.',
    emoji: '✨',
    exampleEn: 'The toad has bumpy skin.',
    exampleCn: '这只蟾蜍有凹凸不平的皮肤。',
    tip: '💡 smooth skin（光滑皮肤），wet skin（湿润皮肤），bumpy skin（疙瘩皮肤）。'
  },
  'bumpy': {
    word: 'bumpy',
    displayWord: 'bumpy',
    phonetic: '/ˈbʌmpi/',
    pos: 'adj. 形容词 (名词: bump 凸起)',
    cn: '凹凸不平的，有疙瘩的',
    en: 'Not smooth or flat; covered with lumps, bumps, or rough spots.',
    emoji: '🪵',
    exampleEn: 'Toads have bumpy skin.',
    exampleCn: '蟾蜍长着凹凸不平有疙瘩的皮肤。',
    tip: '💡 词根 bump（隆起的小包）+ y（形容词后缀）= bumpy（疙疙瘩瘩的）。'
  },

  // === 2. 老师通知与规则核心词 ===
  'capital': {
    word: 'capital',
    displayWord: 'capital letter',
    phonetic: '/ˈkæpɪtl/',
    pos: 'adj. 大写的 / n. 大写字母',
    cn: '大写的，大写字母',
    en: 'An uppercase letter like A, B, C, used at the start of a sentence.',
    emoji: '🔠',
    exampleEn: 'Every sentence must begin with a capital letter.',
    exampleCn: '每句话开头都必须用大写字母。',
    tip: '💡 英文书写铁律：句首第一字母必须 Capitalize（大写）！'
  },
  'period': {
    word: 'period',
    displayWord: 'period (.)',
    phonetic: '/ˈpɪriəd/',
    pos: 'n. 句号 (标点符号)',
    cn: '句号 (美式英语 .)',
    en: 'A punctuation mark (.) placed at the end of a statement.',
    emoji: '🔴',
    exampleEn: 'Put a period at the end of the sentence.',
    exampleCn: '在句子末尾放上一个句号。',
    tip: '💡 英式英语常称作 full stop，美式英语称为 period。'
  },
  'statement': {
    word: 'statement',
    displayWord: 'statement / statements',
    phonetic: '/ˈsteɪtmənt/',
    pos: 'n. 名词',
    cn: '陈述句，说明',
    en: 'A sentence that tells a fact or thought, ending with a period.',
    emoji: '📜',
    exampleEn: 'Frogs live near water is a true statement.',
    exampleCn: '“青蛙生活在水边”是一个真实的陈述句。',
    tip: '💡 陈述句告诉我们一件事，结尾用句号 (.)。'
  },
  'sentence': {
    word: 'sentence',
    displayWord: 'sentence / sentences',
    phonetic: '/ˈsentəns/',
    pos: 'n. 名词',
    cn: '句子',
    en: 'A group of words giving a complete idea, starting with a capital letter.',
    emoji: '💬',
    exampleEn: 'Rewrite each sentence correctly.',
    exampleCn: '规范正确地改写每一个句子。',
    tip: '💡 一个完整的英文句子包含：大写开头 + 表达完整 + 句末标点。'
  },
  'rewrite': {
    word: 'rewrite',
    displayWord: 'rewrite',
    phonetic: '/ˌriːˈraɪt/',
    pos: 'v. 动词',
    cn: '改写，重写',
    en: 'To write something again in a different or improved way.',
    emoji: '✍️',
    exampleEn: 'Please rewrite the sentence with a pencil.',
    exampleCn: '请用铅笔规范改写这句话。',
    tip: '💡 re- 前缀表示“再次，重新”，rewrite 即“重新写一遍”。'
  },
  'correctly': {
    word: 'correctly',
    displayWord: 'correctly',
    phonetic: '/kəˈrektli/',
    pos: 'adv. 副词',
    cn: '正确地，规范地',
    en: 'In a way that is true, right, or without any mistakes.',
    emoji: '✅',
    exampleEn: 'You answered the question correctly!',
    exampleCn: '你非常正确地回答了这个问题！',
    tip: '💡 correct（正确的）+ ly（副词后缀）= correctly（正确地）。'
  },
  'pencil': {
    word: 'pencil',
    displayWord: 'pencil',
    phonetic: '/ˈpensl/',
    pos: 'n. 名词',
    cn: '铅笔',
    en: 'A writing tool with a graphite core inside a wooden tube.',
    emoji: '✏️',
    exampleEn: 'Use a sharp pencil to write your name.',
    exampleCn: '用削好的铅笔写上你的名字。',
    tip: '💡 老师要求小朋友用铅笔工整书写。'
  },
  'paper': {
    word: 'paper',
    displayWord: 'paper',
    phonetic: '/ˈpeɪpər/',
    pos: 'n. 纸，练习纸',
    cn: '纸，作业纸',
    en: 'Thin material used for writing, drawing, or printing on.',
    emoji: '📄',
    exampleEn: 'Write three sentences on another piece of paper.',
    exampleCn: '在另一张纸上写出三句话。',
    tip: '💡 a piece of paper（一张纸）。'
  },
  'name': {
    word: 'name',
    displayWord: 'name / names',
    phonetic: '/neɪm/',
    pos: 'n. 名词 / v. 命名',
    cn: '名字，姓名',
    en: 'A word by which a person or thing is known.',
    emoji: '🏷️',
    exampleEn: 'Write your name on the line.',
    exampleCn: '在横线上写下你的名字。',
    tip: '💡 练习纸顶部的 "Name ____" 记得写上宝贝自己的名字哦！'
  },
  'three': {
    word: 'three',
    displayWord: 'three (3)',
    phonetic: '/θriː/',
    pos: 'num. 数词',
    cn: '三，3个',
    en: 'The number that is one more than two; 3.',
    emoji: '3️⃣',
    exampleEn: 'Write three sentences about frogs.',
    exampleCn: '写三句关于青蛙的句子。',
    tip: '💡 注意 th 发咬舌音 /θ/。'
  },
  'about': {
    word: 'about',
    displayWord: 'about',
    phonetic: '/əˈbaʊt/',
    pos: 'prep. 介词',
    cn: '关于，有关',
    en: 'On the subject of; concerning.',
    emoji: '📖',
    exampleEn: 'This book is about nature and animals.',
    exampleCn: '这本书是关于大自然和小动物的。',
    tip: '💡 write about ...（写关于……的内容）。'
  },
  'time': {
    word: 'time',
    displayWord: 'time',
    phonetic: '/taɪm/',
    pos: 'n. 名词',
    cn: '时间，次数，经历',
    en: 'A moment, occasion, or experience.',
    emoji: '⏰',
    exampleEn: 'Tell me about a time you saw a frog.',
    exampleCn: '跟我说说你见到青蛙的那一次经历吧。',
    tip: '💡 a time when ... 表示“……的某一次经历”。'
  },
  'saw': {
    word: 'saw',
    displayWord: 'saw (see的过去式)',
    phonetic: '/sɔː/',
    pos: 'v. 动词 (原形: see)',
    cn: '看见，见到了 (过去发生)',
    en: 'Past tense of see; looked at or noticed with the eyes.',
    emoji: '👀',
    exampleEn: 'I saw a little green frog yesterday.',
    exampleCn: '我昨天看见了一只绿色的小青蛙。',
    tip: '💡 过去式变化：see ➔ saw。记录以前发生的事情要用 saw。'
  },
  'see': {
    word: 'see',
    displayWord: 'see',
    phonetic: '/siː/',
    pos: 'v. 动词 (过去式: saw)',
    cn: '看见，观察',
    en: 'To notice with eyes; look at.',
    emoji: '👀',
    exampleEn: 'I see a frog in the pond.',
    exampleCn: '我看见池塘里有一只青蛙。',
    tip: '💡 现在看见用 see，过去看见用 saw。'
  },

  // === 3. 拓展小作文高频词 ===
  'pond': {
    word: 'pond',
    displayWord: 'pond',
    phonetic: '/pɑːnd/',
    pos: 'n. 名词',
    cn: '池塘，小水塘',
    en: 'A small body of still water, smaller than a lake.',
    emoji: '🏞️',
    exampleEn: 'Ducks and frogs swim in the pond.',
    exampleCn: '鸭子和青蛙在池塘里游泳。',
    tip: '💡 荷叶和青蛙最常出现的地方。'
  },
  'jump': {
    word: 'jump',
    displayWord: 'jump / jumped',
    phonetic: '/dʒʌmp/',
    pos: 'v. 动词 (过去式: jumped)',
    cn: '跳跃，起跳',
    en: 'To push off the ground into the air using your legs.',
    emoji: '🦘',
    exampleEn: 'The frog jumped into the water with a splash!',
    exampleCn: '青蛙扑通一声跳进了水里！',
    tip: '💡 过去式规则加 ed 变成 jumped [dʒʌmpt]。'
  },
  'jumped': {
    word: 'jumped',
    displayWord: 'jumped (jump的过去式)',
    phonetic: '/dʒʌmpt/',
    pos: 'v. 动词 (原形: jump)',
    cn: '跳跃了，跳了过去',
    en: 'Past tense of jump; leaped into the air.',
    emoji: '🦘',
    exampleEn: 'It jumped onto a big round lily pad.',
    exampleCn: '它跳到了一片又大又圆的荷叶上。',
    tip: '💡 jump ➔ jumped。'
  },
  'hop': {
    word: 'hop',
    displayWord: 'hop / hopped',
    phonetic: '/hɑːp/',
    pos: 'v. 动词 (过去式: hopped)',
    cn: '单脚跳，蹦蹦跳跳',
    en: 'To move by jumping quickly on feet, like a bunny or frog.',
    emoji: '🐰',
    exampleEn: 'The rabbit loves to hop in the garden.',
    exampleCn: '小兔子喜欢在花园里蹦蹦跳跳。',
    tip: '💡 题目里的 "Hop to It" 意思是“赶快行动起来吧！”'
  },
  'hopped': {
    word: 'hopped',
    displayWord: 'hopped (hop的过去式)',
    phonetic: '/hɑːpt/',
    pos: 'v. 动词 (原形: hop)',
    cn: '蹦跳着离开了',
    en: 'Past tense of hop; moved by bouncing jumps.',
    emoji: '🐸',
    exampleEn: 'The toad hopped away into the grass.',
    exampleCn: '小蟾蜍蹦蹦跳跳地跑进了草丛里。',
    tip: '💡 双写 p 加 ed：hop ➔ hopped。'
  },
  'onto': {
    word: 'onto',
    displayWord: 'onto',
    phonetic: '/ˈɑːntuː/',
    pos: 'prep. 介词',
    cn: '到……上面，登上',
    en: 'To a position on or atop a surface.',
    emoji: '⬆️',
    exampleEn: 'The cat leaped onto the wall.',
    exampleCn: '猫咪一跃跳到了墙上。',
    tip: '💡 强调动作的方向性（跳到上面）。'
  },
  'lily': {
    word: 'lily',
    displayWord: 'lily pad / lily',
    phonetic: '/ˈlɪli/',
    pos: 'n. 名词',
    cn: '百合花，睡莲',
    en: 'A plant that grows in water with large floating leaves.',
    emoji: '🪷',
    exampleEn: 'The frog sits on the lily pad.',
    exampleCn: '青蛙正坐在睡莲叶子上。',
    tip: '💡 lily pad 指池塘中漂浮的圆圆睡莲荷叶。'
  },
  'smooth': {
    word: 'smooth',
    displayWord: 'smooth',
    phonetic: '/smuːð/',
    pos: 'adj. 形容词',
    cn: '光滑平整的，无凹凸的',
    en: 'Having a flat, even surface without bumps or rough spots.',
    emoji: '🪞',
    exampleEn: 'The frog has smooth and wet skin.',
    exampleCn: '青蛙拥有光滑且湿润的皮肤。',
    tip: '💡 反义词是 rough（粗糙的）或 bumpy（坑洼的）。'
  },
  'grass': {
    word: 'grass',
    displayWord: 'grass',
    phonetic: '/ɡræs/',
    pos: 'n. 不可数名词',
    cn: '青草，草丛，草坪',
    en: 'Low green plants with narrow leaves covering gardens and fields.',
    emoji: '🌱',
    exampleEn: 'Cows eat green grass.',
    exampleCn: '奶牛吃绿油油的青草。',
    tip: '💡 in the grass（在草丛里）。'
  },
  'yesterday': {
    word: 'yesterday',
    displayWord: 'yesterday',
    phonetic: '/ˈjestərdeɪ/',
    pos: 'adv. / n. 时间副词',
    cn: '昨天',
    en: 'On the day before today.',
    emoji: '📅',
    exampleEn: 'Yesterday was a sunny day.',
    exampleCn: '昨天是一个阳光明媚的大晴天。',
    tip: '💡 句子出现 yesterday 时，动词要用过去式（如 saw, hopped）。'
  },
  'brown': {
    word: 'brown',
    displayWord: 'brown',
    phonetic: '/braʊn/',
    pos: 'adj. 颜色形容词',
    cn: '棕色的，褐色的',
    en: 'Having the color of earth, chocolate, or wood.',
    emoji: '🟤',
    exampleEn: 'I saw a brown toad.',
    exampleCn: '我看到了一只棕褐色的蟾蜍。',
    tip: '💡 蟾蜍在陆地泥土中通常是 brown（棕色）的保护色。'
  },
  'little': {
    word: 'little',
    displayWord: 'little',
    phonetic: '/ˈlɪtl/',
    pos: 'adj. 形容词',
    cn: '小小的，幼小的，可爱的',
    en: 'Small in size or age.',
    emoji: '🤏',
    exampleEn: 'A little tadpole swims in the water.',
    exampleCn: '一只小小的蝌蚪在水里游。',
    tip: '💡 a little frog（一只可爱的小青蛙）。'
  },
  'green': {
    word: 'green',
    displayWord: 'green',
    phonetic: '/ɡriːn/',
    pos: 'adj. 颜色形容词',
    cn: '绿色的',
    en: 'The color of grass and fresh leaves.',
    emoji: '🟢',
    exampleEn: 'The green frog has big eyes.',
    exampleCn: '这只绿色的青蛙长着大眼睛。',
    tip: '💡 青蛙大多是 green 的。'
  },
  'slowly': {
    word: 'slowly',
    displayWord: 'slowly',
    phonetic: '/ˈsloʊli/',
    pos: 'adv. 副词',
    cn: '慢吞吞地，缓缓地',
    en: 'At a slow speed; not quickly.',
    emoji: '🐢',
    exampleEn: 'The turtle moves slowly.',
    exampleCn: '乌龟慢吞吞地爬行。',
    tip: '💡 slow（慢的）+ ly = slowly（慢吞吞地）。反义词是 fast / quickly。'
  },
  'away': {
    word: 'away',
    displayWord: 'away',
    phonetic: '/əˈweɪ/',
    pos: 'adv. 副词',
    cn: '离开，向远处',
    en: 'To or at a distance from a place or person.',
    emoji: '💨',
    exampleEn: 'The frog hopped away into the grass.',
    exampleCn: '小青蛙跳着跑远到了草丛里。',
    tip: '💡 hop away（蹦蹦跳跳地离开）。'
  },
  'cool': {
    word: 'cool',
    displayWord: 'cool',
    phonetic: '/kuːl/',
    pos: 'adj. 形容词',
    cn: '凉爽的，清凉的 / 酷的',
    en: 'Pleasantly low in temperature; not warm.',
    emoji: '❄️',
    exampleEn: 'Frogs like cool and moist water.',
    exampleCn: '青蛙喜欢清凉湿润的水。',
    tip: '💡 cool water（清凉的水）。'
  },
  'excited': {
    word: 'excited',
    displayWord: 'excited',
    phonetic: '/ɪkˈsaɪtɪd/',
    pos: 'adj. 形容词',
    cn: '兴奋的，激动开心的',
    en: 'Feeling very happy, eager, and enthusiastic.',
    emoji: '🤩',
    exampleEn: 'I was excited to see the frog jump.',
    exampleCn: '看到青蛙跳跃我感到非常兴奋开心！',
    tip: '💡 表达小朋友当时的心情。'
  },

  // === 4. 常见基础功能代词与介词 ===
  'the': {
    word: 'the',
    displayWord: 'the',
    phonetic: '/ðə/ or /ðiː/',
    pos: 'art. 定冠词',
    cn: '这(个)，那(些)',
    en: 'Used to point to a specific person, animal, or thing.',
    emoji: '👉',
    exampleEn: 'The frog is green.',
    exampleCn: '这只青蛙是绿色的。',
    tip: '💡 元音发音前读 /ðiː/，辅音前读 /ðə/。'
  },
  'a': {
    word: 'a',
    displayWord: 'a / an',
    phonetic: '/ə/',
    pos: 'art. 不定冠词',
    cn: '一个，一只',
    en: 'Used before a singular noun starting with a consonant sound.',
    emoji: '1️⃣',
    exampleEn: 'I saw a frog.',
    exampleCn: '我看见了一只青蛙。',
    tip: '💡 辅音音素前用 a，元音音素前用 an。'
  },
  'is': {
    word: 'is',
    displayWord: 'is (be动词)',
    phonetic: '/ɪz/',
    pos: 'v. be动词单数',
    cn: '是',
    en: 'Present tense of be for he, she, it, or singular noun.',
    emoji: '⭐',
    exampleEn: 'The toad is brown.',
    exampleCn: '那只蟾蜍是棕色的。',
    tip: '💡 单数主语用 is，复数用 are。'
  },
  'are': {
    word: 'are',
    displayWord: 'are (be动词)',
    phonetic: '/ɑːr/',
    pos: 'v. be动词复数',
    cn: '是 (复数)',
    en: 'Present tense of be for we, you, they, or plural nouns.',
    emoji: '👥',
    exampleEn: 'Frogs are cute animals.',
    exampleCn: '青蛙是可爱的小动物。',
    tip: '💡 复数主语用 are。'
  },
  'it': {
    word: 'it',
    displayWord: 'it',
    phonetic: '/ɪt/',
    pos: 'pron. 代词',
    cn: '它 (指代小动物或物品)',
    en: 'Used to refer to an animal or thing mentioned earlier.',
    emoji: '🐾',
    exampleEn: 'It jumped into the water.',
    exampleCn: '它跳进了水里。',
    tip: '💡 指代前文提到的 frog 或 toad。'
  },
  'i': {
    word: 'i',
    displayWord: 'I',
    phonetic: '/aɪ/',
    pos: 'pron. 人称代词',
    cn: '我',
    en: 'Used by a speaker to refer to himself or herself.',
    emoji: '🙋',
    exampleEn: 'I like frogs.',
    exampleCn: '我喜欢青蛙。',
    tip: '💡 英文中“我”的单字母 I 永远大写！'
  }
}

/**
 * 智能查词函数：根据任意输入的英文单词提取词典卡片数据
 * 自动处理标点符号、大小写、复数（-s, -es）、动词时态（-ed, -ing）
 */
export function lookupWord(rawWord) {
  if (!rawWord) return null

  // 1. 去除首尾标点符号与空格
  const clean = rawWord.trim().replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, '').toLowerCase()
  if (!clean) return null

  // 2. 精确命中
  if (WORD_DICTIONARY[clean]) {
    return WORD_DICTIONARY[clean]
  }

  // 3. 复数变单数规则尝试
  // 规则 1: -es 结尾 (bushes -> bush, branches -> branch)
  if (clean.endsWith('es') && WORD_DICTIONARY[clean.slice(0, -2)]) {
    const base = WORD_DICTIONARY[clean.slice(0, -2)]
    return { ...base, tip: `💡 原词 "${rawWord}" 是 ${base.word} 的复数形式（加 -es）。` }
  }
  // 规则 2: -s 结尾 (tadpoles -> tadpole, frogs -> frog, toads -> toad)
  if (clean.endsWith('s') && WORD_DICTIONARY[clean.slice(0, -1)]) {
    const base = WORD_DICTIONARY[clean.slice(0, -1)]
    return { ...base, tip: `💡 原词 "${rawWord}" 是 ${base.word} 的复数形式（加 -s）。` }
  }

  // 4. 过去式变原形规则尝试
  // 规则 1: 双写 + ed (hopped -> hop)
  if (clean.endsWith('ed') && clean.length > 4 && clean[clean.length - 3] === clean[clean.length - 4]) {
    const baseWord = clean.slice(0, -3)
    if (WORD_DICTIONARY[baseWord]) {
      const base = WORD_DICTIONARY[baseWord]
      return { ...base, tip: `💡 原词 "${rawWord}" 是 ${base.word} 的过去式（双写加 -ed）。` }
    }
  }
  // 规则 2: -ed 结尾 (jumped -> jump)
  if (clean.endsWith('ed') && WORD_DICTIONARY[clean.slice(0, -2)]) {
    const base = WORD_DICTIONARY[clean.slice(0, -2)]
    return { ...base, tip: `💡 原词 "${rawWord}" 是 ${base.word} 的过去式（加 -ed）。` }
  }

  // 5. 进行时 -ing 规则尝试
  if (clean.endsWith('ing') && WORD_DICTIONARY[clean.slice(0, -3)]) {
    const base = WORD_DICTIONARY[clean.slice(0, -3)]
    return { ...base, tip: `💡 原词 "${rawWord}" 是 ${base.word} 的进行时态（加 -ing）。` }
  }

  // 6. 兜底回退：即便词典未收录，也提供自然美音朗读与通用展示
  return {
    word: clean,
    displayWord: rawWord.trim(),
    phonetic: `/${clean}/`,
    pos: '单词',
    cn: '（点击上方发音按钮听标准读音）',
    en: 'An English word in your homework.',
    emoji: '🔍',
    exampleEn: rawWord,
    exampleCn: '努力学习，天天向上！',
    tip: '💡 宝贝多听几遍标准发音，大声读出来加深印象哦！'
  }
}
