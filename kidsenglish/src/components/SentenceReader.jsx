import React, { useState, useEffect, useRef, useMemo } from 'react'
import { speakSentence, speakContinuous, stopSpeech, splitSentences } from '../utils/speech'
import { playPop, playCorrect } from '../utils/sound'

// 预设经典语料（包含用户指定阿宝无人机例句）
const PRESET_SENTENCES = [
  {
    id: 'abao-drone',
    tag: '🚁 示例1：阿宝与无人机',
    title: '阿宝与无人机（用户提问专属例句）',
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

  // 2. 朗读核心模式：连续流利朗读 (continuous) vs 逐句停顿精读 (stepByStep)
  const [readingFlow, setReadingFlow] = useState('continuous') // 'continuous' | 'stepByStep'
  const [engine, setEngine] = useState('auto') // 'auto' | 'baidu' | 'neural'
  const [speed, setSpeed] = useState('normal') // 'slow' | 'normal' | 'fast'
  const [readOrder, setReadOrder] = useState('alternate') // 'alternate' (中英逐句轮读) | 'sequential' (整篇中文后整篇英文)

  // 3. 实时播放状态跟踪
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeItem, setActiveItem] = useState(null) // { mode: 'continuous'|'step', lang: 'zh'|'en'|'mixed', index?: number, chunkInfo?: string }
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

  // 智能分句对齐处理（卡片点读视图使用）
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
      if (/[\u4e00-\u9fa5]/.test(line)) {
        zhParts.push(line)
      } else if (/[a-zA-Z]/.test(line)) {
        enParts.push(line)
      }
    })

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

  // ===================== A. 逐句停顿播放队列 (Step-by-Step) =====================
  const stepPlayQueue = () => {
    if (!isPlayingRef.current) return

    if (queueIndexRef.current >= playQueueRef.current.length) {
      handleStop()
      playCorrect()
      return
    }

    const item = playQueueRef.current[queueIndexRef.current]
    setActiveItem({ mode: 'step', index: item.pairIndex, lang: item.lang })
    scrollToActiveCard(item.pairIndex)

    speakSentence({
      text: item.text,
      lang: item.lang,
      engine,
      speed,
      onEnd: () => {
        if (!isPlayingRef.current) return
        queueIndexRef.current += 1
        timeoutRef.current = setTimeout(() => {
          stepPlayQueue()
        }, 360)
      }
    })
  }

  const startStepQueuePlay = (queue) => {
    handleStop()
    if (!queue || queue.length === 0) return

    playQueueRef.current = queue
    queueIndexRef.current = 0
    isPlayingRef.current = true
    setIsPlaying(true)
    stepPlayQueue()
  }

  // ===================== B. 连续流利长文本播放 (Continuous Stream) =====================
  // 1. 连续朗读全部中文句子（一口气流利播音，不卡顿）
  const handleReadChineseContinuous = () => {
    playPop()
    handleStop()
    if (!chineseText || !chineseText.trim()) return

    isPlayingRef.current = true
    setIsPlaying(true)
    setActiveItem({ mode: 'continuous', lang: 'zh' })

    speakContinuous({
      text: chineseText,
      lang: 'zh',
      engine,
      speed,
      onProgress: (prog) => {
        if (prog.totalChunks > 1) {
          setActiveItem(prev => ({ ...prev, chunkInfo: `第 ${prog.currentChunk}/${prog.totalChunks} 段` }))
        }
      },
      onEnd: () => {
        handleStop()
        playCorrect()
      }
    })
  }

  // 2. 连续朗读全部英文句子（一口气流利播音，不卡顿）
  const handleReadEnglishContinuous = () => {
    playPop()
    handleStop()
    if (!englishText || !englishText.trim()) return

    isPlayingRef.current = true
    setIsPlaying(true)
    setActiveItem({ mode: 'continuous', lang: 'en' })

    speakContinuous({
      text: englishText,
      lang: 'en',
      engine,
      speed,
      onProgress: (prog) => {
        if (prog.totalChunks > 1) {
          setActiveItem(prev => ({ ...prev, chunkInfo: `Part ${prog.currentChunk}/${prog.totalChunks}` }))
        }
      },
      onEnd: () => {
        handleStop()
        playCorrect()
      }
    })
  }

  // 3. 中英整篇连续朗读（流畅读完全部中文后，零停顿紧接着流畅读完全部英文）
  const handleReadBilingualContinuous = () => {
    playPop()
    handleStop()
    if (!chineseText.trim() && !englishText.trim()) return

    isPlayingRef.current = true
    setIsPlaying(true)

    // 如果只有英文
    if (!chineseText.trim()) {
      handleReadEnglishContinuous()
      return
    }

    // 先连续朗读全部中文
    setActiveItem({ mode: 'continuous', lang: 'zh', chunkInfo: '中文连贯朗读' })
    speakContinuous({
      text: chineseText,
      lang: 'zh',
      engine,
      speed,
      onEnd: () => {
        if (!isPlayingRef.current) return
        // 中文结束，立即无缝无卡顿切换到连续英文朗读
        if (englishText && englishText.trim()) {
          setActiveItem({ mode: 'continuous', lang: 'en', chunkInfo: '英文连贯朗读' })
          speakContinuous({
            text: englishText,
            lang: 'en',
            engine,
            speed,
            onEnd: () => {
              handleStop()
              playCorrect()
            }
          })
        } else {
          handleStop()
          playCorrect()
        }
      }
    })
  }

  // 4. 一键中英混读（直接将中文和英文融为一体，整篇一口气播完）
  const handleReadMixedSeamless = () => {
    playPop()
    handleStop()
    const combined = `${chineseText.trim()}\n${englishText.trim()}`
    if (!combined.trim()) return

    isPlayingRef.current = true
    setIsPlaying(true)
    setActiveItem({ mode: 'continuous', lang: 'mixed', chunkInfo: '中英一口气混读' })

    speakContinuous({
      text: combined,
      lang: 'zh', // 百度中文播音引擎原生支持流畅穿插英文单词与整句朗读
      engine,
      speed,
      onEnd: () => {
        handleStop()
        playCorrect()
      }
    })
  }

  // ===================== 统一调度分发 =====================
  // 点击“朗读中文”按钮
  const handleChineseClick = () => {
    if (readingFlow === 'continuous') {
      handleReadChineseContinuous()
    } else {
      playPop()
      const queue = []
      sentencePairs.forEach(p => {
        if (p.zh && p.zh.trim()) queue.push({ pairIndex: p.id, lang: 'zh', text: p.zh })
      })
      startStepQueuePlay(queue)
    }
  }

  // 点击“朗读英文”按钮
  const handleEnglishClick = () => {
    if (readingFlow === 'continuous') {
      handleReadEnglishContinuous()
    } else {
      playPop()
      const queue = []
      sentencePairs.forEach(p => {
        if (p.en && p.en.trim()) queue.push({ pairIndex: p.id, lang: 'en', text: p.en })
      })
      startStepQueuePlay(queue)
    }
  }

  // 点击“中英整篇朗读”按钮
  const handleBilingualClick = () => {
    if (readingFlow === 'continuous') {
      handleReadBilingualContinuous()
    } else {
      playPop()
      const queue = []
      if (readOrder === 'alternate') {
        sentencePairs.forEach(p => {
          if (p.zh && p.zh.trim()) queue.push({ pairIndex: p.id, lang: 'zh', text: p.zh })
          if (p.en && p.en.trim()) queue.push({ pairIndex: p.id, lang: 'en', text: p.en })
        })
      } else {
        sentencePairs.forEach(p => {
          if (p.zh && p.zh.trim()) queue.push({ pairIndex: p.id, lang: 'zh', text: p.zh })
        })
        sentencePairs.forEach(p => {
          if (p.en && p.en.trim()) queue.push({ pairIndex: p.id, lang: 'en', text: p.en })
        })
      }
      startStepQueuePlay(queue)
    }
  }

  // 单独朗读单句卡片
  const handlePlaySingle = (pairIndex, lang) => {
    playPop()
    handleStop()
    const pair = sentencePairs.find(p => p.id === pairIndex)
    if (!pair) return
    const text = lang === 'zh' ? pair.zh : pair.en
    if (!text || !text.trim()) return

    isPlayingRef.current = true
    setIsPlaying(true)
    setActiveItem({ mode: 'step', index: pairIndex, lang })

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

  // 单组中英对照朗读 (单张卡片的中文+英文)
  const handlePlayPair = (pairIndex) => {
    playPop()
    const pair = sentencePairs.find(p => p.id === pairIndex)
    if (!pair) return

    const queue = []
    if (pair.zh && pair.zh.trim()) queue.push({ pairIndex, lang: 'zh', text: pair.zh })
    if (pair.en && pair.en.trim()) queue.push({ pairIndex, lang: 'en', text: pair.en })

    startStepQueuePlay(queue)
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

  // 当前是否处于全文连续朗读态
  const isContinuousZh = isPlaying && activeItem?.mode === 'continuous' && (activeItem?.lang === 'zh' || activeItem?.lang === 'mixed')
  const isContinuousEn = isPlaying && activeItem?.mode === 'continuous' && (activeItem?.lang === 'en' || activeItem?.lang === 'mixed')

  return (
    <div className="sentence-reader-view animate-fade-in">
      {/* 1. 顶部标题栏 */}
      <div className="reader-hero-card">
        <div className="reader-hero-badge">
          <span className="hero-emoji">🗣️</span>
          <div className="hero-titles">
            <h2>双语真人生动朗读工坊</h2>
            <p>支持连续流畅连读与逐句精读跟读 · 百度真人播音级模型 · 清晰准确自然一气呵成</p>
          </div>
        </div>

        {/* 预设例句快捷切换栏 */}
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

      {/* 2. 连续朗读 vs 逐句跟读 核心体验选择器 */}
      <div className="flow-mode-switch-card">
        <div className="flow-mode-title">
          <span className="flow-icon">⚡</span>
          <strong>朗读连贯体验模式：</strong>
        </div>
        <div className="flow-mode-options">
          <button
            className={`flow-mode-btn ${readingFlow === 'continuous' ? 'active' : ''}`}
            onClick={() => { playPop(); setReadingFlow('continuous'); }}
            title="连续流畅朗读全文，自然停顿，不卡断，一气呵成"
          >
            <span className="btn-title">🌊 连续流畅连读（推荐）</span>
            <span className="btn-desc">一口气流利读完全文，语流自然生动，不一句一句停顿</span>
          </button>

          <button
            className={`flow-mode-btn ${readingFlow === 'stepByStep' ? 'active' : ''}`}
            onClick={() => { playPop(); setReadingFlow('stepByStep'); }}
            title="每读完一句自动停顿，适合儿童跟读与模仿"
          >
            <span className="btn-title">🔀 逐句停顿精读</span>
            <span className="btn-desc">一句一句停顿跟读，配合卡拉OK高亮卡片模仿发音</span>
          </button>
        </div>
      </div>

      {/* 3. 文本输入区域 */}
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
            <span>共包含：<strong>{sentencePairs.length}</strong> 组句子</span>
          </div>
        </div>

        {/* 模式 A：中英分栏输入 */}
        {inputMode === 'split' ? (
          <div className="split-inputs-grid">
            <div className={`split-input-box zh-box ${isContinuousZh ? 'reading-continuous-glow-zh' : ''}`}>
              <div className="box-header">
                <span className="box-title">🇨🇳 中文句子输入区</span>
                {isContinuousZh ? (
                  <span className="continuous-live-badge zh animate-pulse">
                    🔊 正在连续真人朗读中文全文...
                  </span>
                ) : (
                  <span className="box-tip">支持换行或用句号标点分句</span>
                )}
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

            <div className={`split-input-box en-box ${isContinuousEn ? 'reading-continuous-glow-en' : ''}`}>
              <div className="box-header">
                <span className="box-title">🇺🇸 英文句子输入区</span>
                {isContinuousEn ? (
                  <span className="continuous-live-badge en animate-pulse">
                    🔊 正在连续真人朗读英文全文...
                  </span>
                ) : (
                  <span className="box-tip">支持换行或用句号（.）分句</span>
                )}
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

      {/* 4. 核心朗读操作控制台 */}
      <div className="reader-controls-card">
        {/* 主要播放动作按钮组 */}
        <div className="primary-action-buttons">
          <button
            className={`action-pill-btn zh-btn ${isPlaying && (activeItem?.lang === 'zh' || isContinuousZh) ? 'active-playing' : ''}`}
            onClick={handleChineseClick}
            title={readingFlow === 'continuous' ? '连续流利朗读中文整段' : '逐句停顿朗读中文'}
          >
            <span className="pill-icon">🇨🇳</span>
            <span className="pill-text">
              {readingFlow === 'continuous' ? '连续流利朗读中文' : '逐句朗读中文'}
            </span>
          </button>

          <button
            className={`action-pill-btn en-btn ${isPlaying && (activeItem?.lang === 'en' || isContinuousEn) ? 'active-playing' : ''}`}
            onClick={handleEnglishClick}
            title={readingFlow === 'continuous' ? '连续流利朗读英文整段' : '逐句停顿朗读英文'}
          >
            <span className="pill-icon">🇺🇸</span>
            <span className="pill-text">
              {readingFlow === 'continuous' ? '连续流利朗读英语' : '逐句朗读英语'}
            </span>
          </button>

          <button
            className={`action-pill-btn bilingual-btn ${isPlaying ? 'glow-reading' : ''}`}
            onClick={handleBilingualClick}
            title={readingFlow === 'continuous' ? '连续流利连读中文与英文（整篇连贯）' : '逐句中英对照停顿轮读'}
          >
            <span className="pill-icon">🔄</span>
            <span className="pill-text">
              {readingFlow === 'continuous' ? '中英整篇连续朗读' : '中英逐句对照朗读'}
            </span>
          </button>

          {/* 连续一口气中英合读按钮 */}
          {readingFlow === 'continuous' && (
            <button
              className="action-pill-btn seamless-btn"
              onClick={handleReadMixedSeamless}
              title="将中英文直接合为一段完整的连贯语流一口气播完"
            >
              <span className="pill-icon">⚡</span>
              <span className="pill-text">中英一气呵成连读</span>
            </button>
          )}

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

          {/* 逐句模式下的轮读顺序 */}
          {readingFlow === 'stepByStep' && (
            <div className="setting-group">
              <span className="group-label">🔁 逐句轮读：</span>
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
          )}
        </div>
      </div>

      {/* 5. 句子对齐卡片展示区 */}
      <div className="reader-cards-section">
        <div className="section-header-row">
          <div className="section-header-title">
            <h3>📑 句子点读与逐句跟读区</h3>
            <span className="section-header-sub">
              {readingFlow === 'continuous'
                ? '已开启【连续流畅连读】：顶部按钮一口气播音；下方单句仍支持单点播放'
                : '已开启【逐句停顿精读】：系统将逐句朗读并自动高亮卡片'}
            </span>
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
            <h4>💡 真人连续播音实现原理</h4>
            <ul>
              <li>
                <strong>1. 连续长音频流调度：</strong> 
                系统通过 <code>speakContinuous</code> 机制，直接将多句连贯段落作为完整语流传给百度真人发音模型，在保证不超过 HTTP GET 限制的前提下，通过句法边界算法自动做 200 字自然切分并零延迟衔接，实现真正一气呵成的连贯播报！
              </li>
              <li>
                <strong>2. 纯正真人声音：</strong> 
                百度播音级模型具备真人播音员的重音、轻声与连读连贯性，无论中长段落都能自然播读。
              </li>
              <li>
                <strong>3. 两种模式自由选择：</strong> 
                喜欢自然流畅听全文的可以选择“连续流畅连读”；希望孩子一句一句跟读模仿的可以选择“逐句停顿精读”。
              </li>
            </ul>
          </div>
        )}

        {/* 句子卡片列表 */}
        <div className="sentence-cards-list">
          {sentencePairs.map((pair) => {
            const isZhActive = isPlaying && activeItem?.mode === 'step' && activeItem?.index === pair.id && activeItem?.lang === 'zh'
            const isEnActive = isPlaying && activeItem?.mode === 'step' && activeItem?.index === pair.id && activeItem?.lang === 'en'
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
                        正在逐句跟读中...
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
