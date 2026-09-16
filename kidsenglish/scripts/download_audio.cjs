const fs = require('fs')
const https = require('https')
const path = require('path')

const dir = path.join(__dirname, '..', 'public', 'pinyin_audio')
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

const items = [
  // 23 个声母标准真人发音
  { name: 'b', text: '玻', spd: 4 },
  { name: 'p', text: '坡', spd: 4 },
  { name: 'm', text: '摸', spd: 4 },
  { name: 'f', text: '佛', spd: 4 },
  { name: 'd', text: '得', spd: 4 },
  { name: 't', text: '特', spd: 4 },
  { name: 'n', text: '讷', spd: 4 },
  { name: 'l', text: '勒', spd: 4 },
  { name: 'g', text: '哥', spd: 4 },
  { name: 'k', text: '科', spd: 4 },
  { name: 'h', text: '喝', spd: 4 },
  { name: 'j', text: '基', spd: 4 },
  { name: 'q', text: '欺', spd: 4 },
  { name: 'x', text: '希', spd: 4 },
  { name: 'zh', text: '知', spd: 4 },
  { name: 'ch', text: '吃', spd: 4 },
  { name: 'sh', text: '诗', spd: 4 },
  { name: 'r', text: '日', spd: 4 },
  { name: 'z', text: '资', spd: 4 },
  { name: 'c', text: '疵', spd: 4 },
  { name: 's', text: '思', spd: 4 },
  { name: 'y', text: '衣', spd: 4 },
  { name: 'w', text: '乌', spd: 4 },

  // 单韵母
  { name: 'a', text: '啊', spd: 4 },
  { name: 'o', text: '喔', spd: 4 },
  { name: 'e', text: '婀', spd: 4 },
  { name: 'i', text: '衣', spd: 4 },
  { name: 'u', text: '乌', spd: 4 },
  { name: 'v', text: '迂', spd: 4 },

  // 慢速跟读版
  { name: 'b_slow', text: '玻', spd: 3 },
  { name: 'p_slow', text: '坡', spd: 3 },
  { name: 'm_slow', text: '摸', spd: 3 },
  { name: 'f_slow', text: '佛', spd: 3 },
  { name: 'a_slow', text: '啊', spd: 3 },
  { name: 'o_slow', text: '喔', spd: 3 },
  { name: 'e_slow', text: '婀', spd: 3 },

  // 带调韵母
  { name: 'a_1', text: 'ā', spd: 4 },
  { name: 'a_2', text: 'á', spd: 4 },
  { name: 'a_3', text: 'ǎ', spd: 4 },
  { name: 'a_4', text: 'à', spd: 4 },
  { name: 'o_1', text: 'ō', spd: 4 },
  { name: 'o_2', text: 'ó', spd: 4 },
  { name: 'o_3', text: 'ǒ', spd: 4 },
  { name: 'o_4', text: 'ò', spd: 4 },
  { name: 'e_1', text: 'ē', spd: 4 },
  { name: 'e_2', text: 'é', spd: 4 },
  { name: 'i_1', text: 'ī', spd: 4 },
  { name: 'u_1', text: 'ū', spd: 4 },

  // 常用拼读音节
  { name: 'ba_1', text: '八', spd: 4 },
  { name: 'pa_2', text: '爬', spd: 4 },
  { name: 'ma_1', text: '妈', spd: 4 },
  { name: 'fa_4', text: '发', spd: 4 },
  { name: 'po_1', text: '坡', spd: 4 },
  { name: 'bo_1', text: '波', spd: 4 },

  // 连贯拼读碰碰乐
  { name: 'blend_bl1', text: '玻……啊……八！八只鸭子！', spd: 4 },
  { name: 'blend_bl2', text: '坡……爬……爬！小猴爬树！', spd: 4 },
  { name: 'blend_bl3', text: '摸……啊……妈！可爱的妈妈！', spd: 4 },
  { name: 'blend_bl4', text: '佛……发……发！理发头发！', spd: 4 },
  { name: 'blend_bl_prev_1', text: '玻……啊……八！数字八！', spd: 4 },
  { name: 'blend_bl_prev_2', text: '坡……喔……坡！小山坡！', spd: 4 },
  { name: 'blend_bl_prev_3', text: '摸……啊……妈！好妈妈！', spd: 4 },
  { name: 'blend_bl_prev_4', text: '佛……发……发！梳理头发！', spd: 4 },

  // 例词单独朗读
  { name: 'word_bl1', text: '八，八只鸭子', spd: 4 },
  { name: 'word_bl2', text: '爬，小猴爬树', spd: 4 },
  { name: 'word_bl3', text: '妈，可爱的妈妈', spd: 4 },
  { name: 'word_bl4', text: '发，理发店', spd: 4 },
  { name: 'word_bl_prev_1', text: '八，数字八', spd: 4 },
  { name: 'word_bl_prev_2', text: '坡，小山坡', spd: 4 },
  { name: 'word_bl_prev_3', text: '妈，好妈妈', spd: 4 },
  { name: 'word_bl_prev_4', text: '发，梳理头发', spd: 4 }
]

async function downloadAll() {
  console.log('Downloading ' + items.length + ' human voice pinyin MP3s...')
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const filePath = path.join(dir, item.name + '.mp3')
    const url = 'https://fanyi.baidu.com/gettts?lan=zh&text=' + encodeURIComponent(item.text) + '&spd=' + item.spd + '&source=web'

    await new Promise((resolve) => {
      const file = fs.createWriteStream(filePath)
      https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        res.pipe(file)
        file.on('finish', () => {
          file.close()
          const size = fs.statSync(filePath).size
          console.log(`[${i + 1}/${items.length}] ${item.name}.mp3 (${size} bytes) - "${item.text}"`)
          setTimeout(resolve, 80)
        })
      }).on('error', (err) => {
        console.error('Error for ' + item.name + ':', err.message)
        resolve()
      })
    })
  }
  console.log('All ' + items.length + ' Pinyin human audio files generated successfully in public/pinyin_audio/!')
}

downloadAll()
