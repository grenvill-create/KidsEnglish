import React, { useState, useEffect, useRef, useMemo } from 'react'
import { speakSentence, stopSpeech, splitSentences } from '../utils/speech'
import { playPop, playCorrect } from '../utils/sound'

// 预设经典语料（包含用户指定阿宝无人机例句）
const PRESET_SENTENCES = [
  {
    id: 'abao-drone',
    tag: '🚁 示例1：阿宝与无人机',
    title: '阿宝与无人机（用户提问专属示例）',
    zh: '阿宝又听到了一阵“嗡嗡”声，它抬头一看，原来是无人机的螺旋桨发出的声音。',
    en: 'Abao heard another “buzzing” sound. Looking up, he saw that it was made by the spinning propellers of a drone.'
  },
  {
    id: 'school-rules',
    tag: '🏫 示例2：校园规则',
    title: '走廊安静与校园安全（School Rules）',
    zh: '在走廊里我们要轻声慢步，不要奔跑打闹，这样其他班级的同学才能安心学习。',
    en: 'Walk quietly in the hall and do not run, so other classes can study in peace.'
  },
  {
    id: 'tadpoles',
    tag: '🐸 示例3：小蝌蚪找妈妈',
    title: '小蝌蚪变青蛙（Tadpoles and Frogs）',
    zh: '池塘里的小蝌蚪慢慢长出了后腿，又长出了前腿，最后变成了可爱的小青蛙。',
    en: 'The little tadpoles in the pond slowly grew hind legs, then front legs, and finally became little frogs.'
  }
]

export function SentenceReader() {
  // 1. 输入内容状态
  const [chineseText, setChineseText] = useState(PRESET_SENTENCES[0].zh)
  const [englishText, setEnglishText] = useState(PRESET_SENTENCES[0].en)
  const [mixedInput, setMixedInput] = useState(`${PRESET_SENTENCES[0].zh}\n${PRESET_SENTENCES[0].en}`)
  const [inputMode, setInputMode] = useState('split') // 'split' | 'mixed'

  // 2. 播放参数
  const [engine, setEngine] = useState('auto') // 'auto' | 'baidu' | 'neural'
  const [speed, setSpeed] = useState('normal') // 'slow' | 'normal' | 'fast'
  const [readOrder, setReadOrder] = useState('alternate') // 'alternate' (中英逐句轮读) | 'sequential' (整篇中文后整篇英文)

  // 3. 实时播放状态跟踪
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeItem, setActiveItem] = useState(null) // { index: number, lang: 'zh' | 'en' }
  const [copiedId, setCopiedId] = useState(null)
  const [showTechGuide, setShowTechGuide] = useState(false)

  // 引用控制播放队列与定时器
  const playQueueRef = useRef([])
  const queueIndexRef = useRef(0)
  const isPlayingRef = useRef(false)
  const timeoutRef = useRef(null)
  const cardRefs = useRef({})

  // 停止朗读清理
  const handleStop = () => {
    stopSpeech()
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    playQueueRef.current = []
    queueIndexRef.current = 0
    isPlayingRef.current = false
    setIsPlaying(false)
    setActiveItem(null)
  }

  // 组件卸载时自动停止播放
  useEffect(() => {
    return () => {
      handleStop()
    }
  }, [])

  // 智能分句对齐处理
  const sentencePairs = useMemo(() => {
    const zhList = splitSentences(chineseText, 'zh')
    const enList = splitSentences(englishText, 'en')
    const maxLen = Math.max(zhList.length, enList.length, 1)
    const pairs = []

    for (let i = 0; i < maxLen; i++) {
      pairs.push({
        id: i,
        index: i + 1,
        zh: zhList[i] || '',
        en: enList[i] || ''
      })
    }
    return pairs
  }, [chineseText, englishText])

  // 智能识别并拆分混合输入中的中英文
  const handleAutoSplitMixed = () => {
    playPop()
    if (!mixedInput || !mixedInput.trim()) return

    const lines = mixedInput.split('\n').map(l => l.trim()).filter(Boolean)
    const zhParts = []
    const enParts = []

    lines.forEach(line => {
      // 包含中文字符的划入中文，否则划入英文
      if (/[\u4e00-\u9fa5]/.test(line)) {
        zhParts.push(line)
      } else if (/[a-zA-Z]/.test(line)) {
        enParts.push(line)
      }
    })

    // 如果没有换行分行，则通过连续中英文正则切割
    if (zhParts.length === 0 || enParts.length === 0) {
      const matchZh = mixedInput.match(/[\u4e00-\u9fa5\uff00-\uffef“”，。！？；：、\s]+/g)
      const matchEn = mixedInput.match(/[a-zA-Z0-9\s.,!?'"“”—\-]+/g)
      if (matchZh) zhParts.push(matchZh.join(' ').trim())
      if (matchEn) enParts.push(matchEn.join(' ').trim())
    }

    const newZh = zhParts.join('\n').trim()
    const newEn = enParts.join('\n').trim()

    if (newZh) setChineseText(newZh)
    if (newEn) setEnglishText(newEn)
    setInputMode('split')
    playCorrect()
  }

  // 选择预设例句
  const handleSelectPreset = (preset) => {
    playPop()
    handleStop()
    setChineseText(preset.zh)
    setEnglishText(preset.en)
    setMixedInput(`${preset.zh}\n${preset.en}`)
  }

  // 清空文本
  const handleClear = () => {
    playPop()
    handleStop()
    setChineseText('')
    setEnglishText('')
    setMixedInput('')
  }

  // 滚动正在朗读的卡片到视野中心
  const scrollToActiveCard = (pairIndex) => {
    const el = cardRefs.current[pairIndex]
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }

  // 队列步进播放器
  const stepPlayQueue = () => {
    if (!isPlayingRef.current) return

    if (queueIndexRef.current >= playQueueRef.current.length) {
      // 全部播放完毕
      handleStop()
      playSuccess()
      return
    }

    const item = playQueueRef.current[queueIndexRef.current]
    setActiveItem({ index: item.pairIndex, lang: item.lang })
    scrollToActiveCard(item.pairIndex)

    speakSentence({
      text: item.text,
      lang: item.lang,
      engine,
      speed,
      onEnd: () => {
        if (!isPlayingRef.current) return
        queueIndexRef.current += 1
        // 句与句之间给予 380ms 自然换气停顿
        timeoutRef.current = setTimeout(() => {
          stepPlayQueue()
        }, 380)
      }
    })
  }

  // 启动队列播放
  const startQueuePlay = (queue) => {
    handleStop()
    if (!queue || queue.length === 0) return

    playQueueRef.current = queue
    queueIndexRef.current = 0
    isPlayingRef.current = true
    setIsPlaying(true)
    stepPlayQueue()
  }

  // 1. 仅朗读中文
  const handleReadChineseAll = () => {
    playPop()
    const queue = []
    sentencePairs.forEach(p => {
      if (p.zh && p.zh.trim()) {
        queue.push({ pairIndex: p.id, lang: 'zh', text: p.zh })
      }
    })
    startQueuePlay(queue)
  }

  // 2. 仅朗读英文
  const handleReadEnglishAll = () => {
    playPop()
    const queue = []
    sentencePairs.forEach(p => {
      if (p.en && p.en.trim()) {
        queue.push({ pairIndex: p.id, lang: 'en', text: p.en })
      }
    })
    startQueuePlay(queue)
  }

  // 3. 中英双语整篇连读
  const handleReadBilingualAll = () => {
    playPop()
    const queue = []

    if (readOrder === 'alternate') {
      // 逐句对照轮读：中文1 -> 英文1 -> 中文2 -> 英文2...
      sentencePairs.forEach(p => {
        if (p.zh && p.zh.trim()) {
          queue.push({ pairIndex: p.id, lang: 'zh', text: p.zh })
        }
        if (p.en && p.en.trim()) {
          queue.push({ pairIndex: p.id, lang: 'en', text: p.en })
        }
      })
    } else {
      // 顺序朗读：全部中文 -> 全部英文
      sentencePairs.forEach(p => {
        if (p.zh && p.zh.trim()) {
          queue.push({ pairIndex: p.id, lang: 'zh', text: p.zh })
        }
      })
      sentencePairs.forEach(p => {
        if (p.en && p.en.trim()) {
          queue.push({ pairIndex: p.id, lang: 'en', text: p.en })
        }
      })
    }

    startQueuePlay(queue)
  }

  // 4. 单独朗读单句卡片
  const handlePlaySingle = (pairIndex, lang) => {
    playPop()
    handleStop()
    const pair = sentencePairs.find(p => p.id === pairIndex)
    if (!pair) return
    const text = lang === 'zh' ? pair.zh : pair.en
    if (!text || !text.trim()) return

    isPlayingRef.current = true
    setIsPlaying(true)
    setActiveItem({ index: pairIndex, lang })

    speakSentence({
      text,
      lang,
      engine,
      speed,
      onEnd: () => {
        handleStop()
      }
    })
  }

  // 5. 单组中英对照朗读 (单张卡片的中文+英文)
  const handlePlayPair = (pairIndex) => {
    playPop()
    const pair = sentencePairs.find(p => p.id === pairIndex)
    if (!pair) return

    const queue = []
    if (pair.zh && pair.zh.trim()) queue.push({ pairIndex, lang: 'zh', text: pair.zh })
    if (pair.en && pair.en.trim()) queue.push({ pairIndex, lang: 'en', text: pair.en })

    startQueuePlay(queue)
  }

  // 复制文本到剪贴板
  const handleCopyText = (id, text) => {
    if (!text) return
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
      })
    }
  }

  return (
    <div className="sentence-reader-view animate-fade-in">
      {/* 1. 顶部标题栏 */}
      <div className="reader-hero-card">
        <div className="reader-hero-badge">
          <span className="hero-emoji">🗣️</span>
          <div className="hero-titles">
            <h2>双语真人生动朗读工坊</h2>
            <p>输入任意中英文句子 · 百度真人播音级模型 · 支持单独朗读中文、英文或中英整篇对照跟读</p>
          </div>
        </div>

        {/* 快捷示例切换 */}
        <div className="preset-examples-bar">
          <span className="preset-label">💡 经典例句推荐：</span>
          <div className="preset-buttons">
            {PRESET_SENTENCES.map(p => (
              <button
                key={p.id}
                className={`preset-pill ${chineseText === p.zh ? 'active' : ''}`}
                onClick={() => handleSelectPreset(p)}
                title={p.title}
              >
                {p.tag}
              </button>
            ))}
            <button className="preset-pill clear-pill" onClick={handleClear} title="清空所有输入框">
              🧹 清空文本
            </button>
          </div>
        </div>
      </div>

      {/* 2. 文本输入区域 */}
      <div className="reader-input-panel">
        <div className="input-panel-header">
          <div className="mode-toggle-group">
            <button
              className={`mode-toggle-btn ${inputMode === 'split' ? 'active' : ''}`}
              onClick={() => { playPop(); setInputMode('split'); }}
            >
              🇨🇳 🇺🇸 中英分栏输入
            </button>
            <button
              className={`mode-toggle-btn ${inputMode === 'mixed' ? 'active' : ''}`}
              onClick={() => { playPop(); setInputMode('mixed'); }}
            >
              🪄 智能整段混合粘贴
            </button>
          </div>

          <div className="input-stats-badge">
            <span>已解析：<strong>{sentencePairs.length}</strong> 组句子</span>
          </div>
        </div>

        {/* 模式 A：中英分栏输入 */}
        {inputMode === 'split' ? (
          <div className="split-inputs-grid">
            <div className="split-input-box zh-box">
              <div className="box-header">
                <span className="box-title">🇨🇳 中文句子输入区</span>
                <span className="box-tip">支持换行或用句号标点分句</span>
              </div>
              <textarea
                className="sentence-textarea"
                rows={4}
                value={chineseText}
                onChange={(e) => setChineseText(e.target.value)}
                placeholder="在此输入中文句子，例如：阿宝又听到了一阵“嗡嗡”声，它抬头一看，原来是无人机的螺旋桨发出的声音。"
              />
              <div className="textarea-footer">
                <span>字数：{chineseText.length} 字</span>
                <button
                  className="quick-clear-text"
                  onClick={() => setChineseText('')}
                  title="清空中文"
                >
                  清空
                </button>
              </div>
            </div>

            <div className="split-input-box en-box">
              <div className="box-header">
                <span className="box-title">🇺🇸 英文句子输入区</span>
                <span className="box-tip">支持换行或用句号（.）分句</span>
              </div>
              <textarea
                className="sentence-textarea en-font"
                rows={4}
                value={englishText}
                onChange={(e) => setEnglishText(e.target.value)}
                placeholder="Enter English sentences here, e.g. Abao heard another “buzzing” sound. Looking up, he saw that it was made by the spinning propellers of a drone."
              />
              <div className="textarea-footer">
                <span>单词：{englishText.split(/\s+/).filter(Boolean).length} 词</span>
                <button
                  className="quick-clear-text"
                  onClick={() => setEnglishText('')}
                  title="清空英文"
                >
                  清空
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* 模式 B：智能混合粘贴与提取 */
          <div className="mixed-input-box">
            <div className="box-header">
              <span className="box-title">🪄 混合文本一键粘贴区</span>
              <span className="box-tip">将老师发的整段中英句子直接粘贴在这里</span>
            </div>
            <textarea
              className="sentence-textarea mixed-textarea"
              rows={5}
              value={mixedInput}
              onChange={(e) => setMixedInput(e.target.value)}
              placeholder="直接粘贴中英混合段落，例如：&#10;阿宝又听到了一阵“嗡嗡”声，它抬头一看，原来是无人机的螺旋桨发出的声音&#10;Abao heard another “buzzing” sound. Looking up, he saw that it was made by the spinning propellers of a drone."
            />
            <div className="mixed-action-footer">
              <button className="auto-split-btn" onClick={handleAutoSplitMixed}>
                ✨ 智能提取并拆分中英文
              </button>
              <span className="split-hint">系统将自动识别汉字与英文字符，智能对齐句子</span>
            </div>
          </div>
        )}
      </div>

      {/* 3. 核心朗读操作控制台 */}
      <div className="reader-controls-card">
        {/* 主要播放动作按钮组 */}
        <div className="primary-action-buttons">
          <button
            className={`action-pill-btn zh-btn ${isPlaying && activeItem?.lang === 'zh' ? 'active-playing' : ''}`}
            onClick={handleReadChineseAll}
            title="朗读全部中文句子"
          >
            <span className="pill-icon">🇨🇳</span>
            <span className="pill-text">朗读中文句子</span>
          </button>

          <button
            className={`action-pill-btn en-btn ${isPlaying && activeItem?.lang === 'en' ? 'active-playing' : ''}`}
            onClick={handleReadEnglishAll}
            title="朗读全部英文句子"
          >
            <span className="pill-icon">🇺🇸</span>
            <span className="pill-text">朗读英语句子</span>
          </button>

          <button
            className={`action-pill-btn bilingual-btn ${isPlaying ? 'glow-reading' : ''}`}
            onClick={handleReadBilingualAll}
            title="中英文整篇对照朗读"
          >
            <span className="pill-icon">🔄</span>
            <span className="pill-text">中英整篇一起朗读</span>
          </button>

          {isPlaying && (
            <button className="action-pill-btn stop-btn animate-pop" onClick={handleStop} title="停止当前朗读">
              <span className="pill-icon">⏹️</span>
              <span className="pill-text">停止朗读</span>
            </button>
          )}
        </div>

        {/* 辅助调节栏：语音模型、语速、连读模式 */}
        <div className="settings-compact-bar">
          {/* 语音模型选择 */}
          <div className="setting-group">
            <span className="group-label">🎙️ 发音模型：</span>
            <div className="radio-pills">
              <button
                className={`radio-pill ${engine === 'auto' ? 'active' : ''}`}
                onClick={() => setEngine('auto')}
                title="优先百度真人广播音，若遇网络波动自动切换至微软神经网络音"
              >
                🌟 智能优选 (百度真人+自然音)
              </button>
              <button
                className={`radio-pill ${engine === 'baidu' ? 'active' : ''}`}
                onClick={() => setEngine('baidu')}
                title="百度在线真人广播员模型发音"
              >
                🎙️ 百度真人播音
              </button>
              <button
                className={`radio-pill ${engine === 'neural' ? 'active' : ''}`}
                onClick={() => setEngine('neural')}
                title="微软晓晓/Jenny 等神经网络超拟人大模型"
              >
                🤖 微软/系统神经网络
              </button>
            </div>
          </div>

          {/* 语速调节 */}
          <div className="setting-group">
            <span className="group-label">🐢 朗读语速：</span>
            <div className="radio-pills">
              <button
                className={`radio-pill ${speed === 'slow' ? 'active' : ''}`}
                onClick={() => setSpeed('slow')}
                title="慢速（0.8x），适合跟读与听写"
              >
                🐢 慢速跟读
              </button>
              <button
                className={`radio-pill ${speed === 'normal' ? 'active' : ''}`}
                onClick={() => setSpeed('normal')}
                title="常速（1.0x），标准广播语速"
              >
                🚶 常速标准
              </button>
              <button
                className={`radio-pill ${speed === 'fast' ? 'active' : ''}`}
                onClick={() => setSpeed('fast')}
                title="稍快（1.2x），流利提高"
              >
                🏃 稍快挑战
              </button>
            </div>
          </div>

          {/* 连读模式 */}
          <div className="setting-group">
            <span className="group-label">🔁 连读方式：</span>
            <div className="radio-pills">
              <button
                className={`radio-pill ${readOrder === 'alternate' ? 'active' : ''}`}
                onClick={() => setReadOrder('alternate')}
                title="读完一句中文，立刻读对应的英文句子"
              >
                🔀 逐句中英交替
              </button>
              <button
                className={`radio-pill ${readOrder === 'sequential' ? 'active' : ''}`}
                onClick={() => setReadOrder('sequential')}
                title="整篇中文读完后，再读整篇英文"
              >
                📜 先中文后英文
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. 句子对齐卡片展示区 */}
      <div className="reader-cards-section">
        <div className="section-header-row">
          <div className="section-header-title">
            <h3>📑 句子点读与逐句跟读区</h3>
            <span className="section-header-sub">点击卡片中的单独按钮，即可单独朗读任意单句</span>
          </div>

          <button
            className="tech-guide-toggle-btn"
            onClick={() => setShowTechGuide(!showTechGuide)}
          >
            💡 查看技术实现原理 {showTechGuide ? '▲' : '▼'}
          </button>
        </div>

        {/* 技术原理解释面板 */}
        {showTechGuide && (
          <div className="tech-guide-panel animate-pop">
            <h4>💡 真人播音模型实现技术揭秘</h4>
            <ul>
              <li>
                <strong>1. 百度在线真人播音模型：</strong> 
                系统采用百度翻译云端真人播音模型接口，直接流式请求音频并注入到浏览器多媒体管道中。中文发音字正腔圆，情感停顿自然；英文由地道母语者播音。
              </li>
              <li>
                <strong>2. 微软 Edge / Azure 神经网络自然大模型：</strong> 
                系统优选了浏览器深度学习语音引擎（如 <em>Microsoft Xiaoxiao Natural</em> 与 <em>Jenny Natural</em>），具备真实换气声、语气起伏与高保真语音特征。
              </li>
              <li>
                <strong>3. 智能容错双引擎：</strong> 
                在“智能优选”模式下，系统会优先请求百度真人广播音频流；若遇离线或设备拦截，毫秒级无缝切换为神经网络自然语音，确保无论在任何网络环境下都清晰流畅。
              </li>
              <li>
                <strong>4. 句子边界切分与卡拉OK高亮：</strong> 
                前端通过高阶正向预查正则匹配标点符号（。！？；与 . ! ? ;），并维持播放状态队列，让孩子在听的同时眼睛紧跟高亮句子，达成视听同步！
              </li>
            </ul>
          </div>
        )}

        {/* 句子卡片列表 */}
        <div className="sentence-cards-list">
          {sentencePairs.map((pair) => {
            const isZhActive = isPlaying && activeItem?.index === pair.id && activeItem?.lang === 'zh'
            const isEnActive = isPlaying && activeItem?.index === pair.id && activeItem?.lang === 'en'
            const isPairActive = isZhActive || isEnActive

            return (
              <div
                key={pair.id}
                ref={(el) => (cardRefs.current[pair.id] = el)}
                className={`sentence-pair-card ${isPairActive ? 'active-reading-glow' : ''}`}
              >
                {/* 卡片头部编号与操作 */}
                <div className="card-top-bar">
                  <div className="pair-index-badge">
                    <span>第 {pair.index} 句</span>
                    {isPairActive && (
                      <span className="reading-indicator-tag animate-pulse">
                        <span className="sound-wave-icon">🔊</span>
                        正在真人朗读中...
                      </span>
                    )}
                  </div>

                  <div className="pair-actions">
                    <button
                      className="pair-play-btn"
                      onClick={() => handlePlayPair(pair.id)}
                      title="单独连读这组中英文"
                    >
                      🔄 连读这组
                    </button>
                    <button
                      className="pair-copy-btn"
                      onClick={() => handleCopyText(`pair-${pair.id}`, `${pair.zh}\n${pair.en}`)}
                      title="复制本句中英文"
                    >
                      {copiedId === `pair-${pair.id}` ? '✅ 已复制' : '📋 复制'}
                    </button>
                  </div>
                </div>

                {/* 中文单句行 */}
                <div className={`sentence-row zh-row ${isZhActive ? 'sentence-highlight-zh' : ''}`}>
                  <div className="row-prefix">
                    <span className="lang-tag zh-tag">中文</span>
                  </div>
                  <div className="row-content" onClick={() => handlePlaySingle(pair.id, 'zh')}>
                    <p className="sentence-text zh-text">{pair.zh || <em className="empty-text">（未输入中文句子）</em>}</p>
                  </div>
                  <div className="row-actions">
                    <button
                      className={`single-speak-btn ${isZhActive ? 'active' : ''}`}
                      onClick={() => handlePlaySingle(pair.id, 'zh')}
                      title="单独朗读中文句子"
                    >
                      {isZhActive ? '🔊 播音中' : '🔈 读中文'}
                    </button>
                  </div>
                </div>

                {/* 英文单句行 */}
                <div className={`sentence-row en-row ${isEnActive ? 'sentence-highlight-en' : ''}`}>
                  <div className="row-prefix">
                    <span className="lang-tag en-tag">English</span>
                  </div>
                  <div className="row-content" onClick={() => handlePlaySingle(pair.id, 'en')}>
                    <p className="sentence-text en-text">{pair.en || <em className="empty-text">（No English sentence）</em>}</p>
                  </div>
                  <div className="row-actions">
                    <button
                      className={`single-speak-btn ${isEnActive ? 'active' : ''}`}
                      onClick={() => handlePlaySingle(pair.id, 'en')}
                      title="单独朗读英文句子"
                    >
                      {isEnActive ? '🔊 Reading' : '🔈 读英文'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
export default SentenceReader
