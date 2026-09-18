import React, { useState, useEffect } from 'react'
import { speakEnglish, stopSpeech } from '../utils/speech'
import { playPop, playCorrect, playTryAgain, playMagic, playCheer } from '../utils/sound'
import { WordDetailModal } from './WordDetailModal'
import { InteractiveSentence } from './InteractiveSentence'
import { lookupWord } from '../data/dictionary'

export function ActionImage({ src, alt, emoji, className = '' }) {
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setHasError(false)
    setIsLoaded(false)
  }, [src])

  if (hasError || !src) {
    return (
      <div className={`action-fallback-card ${className}`}>
        <span className="fallback-emoji">{emoji || '✨'}</span>
        <span className="fallback-text">{alt}</span>
      </div>
    )
  }

  return (
    <>
      {!isLoaded && (
        <div className={`action-skeleton-placeholder ${className}`}>
          <span className="skeleton-emoji">{emoji}</span>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoaded ? 'img-ready' : 'img-hidden'}`}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
    </>
  )
}

export function EnglishHomework({ data, isCompleted, onCompleteTask }) {
  // 判断当前作业类型：若是今日的青蛙蟾蜍句子改写作业 (Hop to It Some More)
  const isStatementsType = Boolean(data && data.sentences && data.sentences.length > 0)

  if (isStatementsType) {
    return <StatementsHomeworkView data={data} isCompleted={isCompleted} onCompleteTask={onCompleteTask} />
  }

  return <ActionWordsHomeworkView data={data} isCompleted={isCompleted} onCompleteTask={onCompleteTask} />
}

/**
 * 今日新作业：Hop to It Some More! (句子首字母大写与标点改写 + 3句话小作文工作坊)
 */
function StatementsHomeworkView({ data, isCompleted, onCompleteTask }) {
  const [activeSubTab, setActiveSubTab] = useState('rewrite') // 'rewrite' | 'quiz' | 'writing' | 'cards' | 'listening'
  const [currentSentIdx, setCurrentSentIdx] = useState(0)
  
  // 改写魔法状态
  const [isCapitalized, setIsCapitalized] = useState(false)
  const [hasPeriodAdded, setHasPeriodAdded] = useState(false)

  // 找茬改错挑战状态
  const [quizIdx, setQuizIdx] = useState(0)
  const [quizFeedback, setQuizFeedback] = useState(null)
  const [quizScore, setQuizScore] = useState(0)

  // 拓展写话状态
  const [activeSampleIdx, setActiveSampleIdx] = useState(0)

  // 听音辨句测验状态
  const [listeningTarget, setListeningTarget] = useState(null)
  const [listeningFeedback, setListeningFeedback] = useState(null)
  const [listeningScore, setListeningScore] = useState(0)

  // 词典卡片弹窗状态
  const [selectedWordData, setSelectedWordData] = useState(null)

  const handleWordClick = (rawWord) => {
    playPop()
    const wordInfo = lookupWord(rawWord)
    if (wordInfo) {
      setSelectedWordData(wordInfo)
    }
  }

  const sentences = data.sentences || []
  const currentSent = sentences[currentSentIdx] || sentences[0]
  const words = data.words || []
  const writingTask = data.writingWorkshop || {}

  useEffect(() => {
    setIsCapitalized(false)
    setHasPeriodAdded(false)
  }, [currentSentIdx])

  const handleApplyCapital = () => {
    playMagic()
    setIsCapitalized(true)
  }

  const handleApplyPeriod = () => {
    playCorrect()
    setHasPeriodAdded(true)
  }

  const handleApplyAll = () => {
    playMagic()
    setIsCapitalized(true)
    setHasPeriodAdded(true)
    speakEnglish(currentSent.corrected)
  }

  // 初始化听音小测试
  const initListeningQuiz = () => {
    if (sentences.length === 0) return
    const target = sentences[Math.floor(Math.random() * sentences.length)]
    setListeningTarget(target)
    setListeningFeedback(null)
    speakEnglish(target.corrected)
  }

  useEffect(() => {
    if (activeSubTab === 'listening') {
      initListeningQuiz()
    }
  }, [activeSubTab])

  const handleListeningAnswer = (item) => {
    if (item.id === listeningTarget.id) {
      playCorrect()
      setListeningFeedback('correct')
      setListeningScore(prev => prev + 1)
      setTimeout(() => {
        initListeningQuiz()
      }, 1400)
    } else {
      playTryAgain()
      setListeningFeedback('wrong')
    }
  }

  return (
    <div className="english-view statements-view">
      {/* 顶部二级导航 */}
      <div className="sub-nav-bar">
        <button 
          className={`sub-tab-btn ${activeSubTab === 'rewrite' ? 'active' : ''}`}
          onClick={() => { playPop(); setActiveSubTab('rewrite'); }}
        >
          {data.theme === 'sweet-sentences' ? '🍬 糖果三段式造句' : (data.theme === 'counting-sheep' ? '🐑 睡前句子规范秀' : '✏️ 句子改写互动秀')} ({currentSentIdx + 1}/{sentences.length})
        </button>

        <button 
          className={`sub-tab-btn ${activeSubTab === 'quiz' ? 'active' : ''}`}
          onClick={() => { playPop(); setActiveSubTab('quiz'); }}
        >
          {data.theme === 'sweet-sentences' ? '🔍 句子三成分拆解与闯关' : (data.theme === 'counting-sheep' ? '⭐ 小羊首字母大写闯关' : '🐸 找茬改错闯关')}
        </button>

        <button 
          className={`sub-tab-btn ${activeSubTab === 'writing' ? 'active' : ''}`}
          onClick={() => { playPop(); setActiveSubTab('writing'); }}
        >
          {data.theme === 'sweet-sentences' ? '🍭 自由糖果拼词台' : (data.theme === 'counting-sheep' ? '📖 睡前绘本抄写专区' : '📝 3句话小作文指导')}
        </button>

        <button 
          className={`sub-tab-btn ${activeSubTab === 'cards' ? 'active' : ''}`}
          onClick={() => { playPop(); setActiveSubTab('cards'); }}
        >
          🗂️ 核心词汇闪卡 ({words.length})
        </button>

        <button 
          className={`sub-tab-btn ${activeSubTab === 'listening' ? 'active' : ''}`}
          onClick={() => { playPop(); setActiveSubTab('listening'); }}
        >
          👂 听音辨句测验
        </button>
      </div>

      {/* --- 模式 1：句子规范改写与互动施法 --- */}
      {activeSubTab === 'rewrite' && currentSent && (
        <div className="statements-stage-container">
          {/* 规则提醒小横幅 */}
          <div className="rule-banner-box">
            <div className="rule-banner-header">
              <span className="banner-title-icon">{data.theme === 'sweet-sentences' ? '🍬' : (data.theme === 'counting-sheep' ? '🐑' : '🐸')}</span>
              <strong>{data.title || (data.theme === 'sweet-sentences' ? 'Sweet Sentences: Writing 3-part sentences 🍬' : (data.theme === 'counting-sheep' ? 'Counting Sheep: Capitalizing sentence beginnings 🐑' : 'Hop to It Some More! 句子大写与标点规范'))}</strong>
            </div>
            <p className="rule-teacher-quote">
              <strong>👩‍🏫 老师作业要求：</strong> {data.teacherNote}
            </p>
            <div className="rule-badges-grid">
              <div className="rule-chip">
                <span className="chip-icon">🔠</span>
                <span className="chip-text"><strong>首字母大写</strong>：句首单词首字母必须写成大写！</span>
              </div>
              <div className="rule-chip">
                <span className="chip-icon">🔴</span>
                <span className="chip-text"><strong>句末加标点</strong>：陈述句结尾必须加圆点句号 (.)！</span>
              </div>
              <div className="rule-chip">
                <span className="chip-icon">✏️</span>
                <span className="chip-text"><strong>铅笔工整书写</strong>：单词间空出一指宽距离！</span>
              </div>
            </div>
          </div>

          {/* 单词点击即查小助手提示 */}
          <div className="word-lookup-helper-tip">
            <span className="helper-tip-icon">💡</span>
            <div className="helper-tip-content">
              <strong>生词随时点：</strong>遇到不认识的单词？直接<strong>点击句子里的任意英文单词</strong>，即可查看纯正发音、国际音标与中英详细解释！
            </div>
          </div>

          {/* 主改写操作卡片 */}
          <div className="statement-rewrite-card animate-pop">
            {/* 卡片头部：题号与插图 */}
            <div className="statement-card-top">
              <div className="question-number-badge">
                <span className="badge-num">第 {currentSent.num} 题</span>
                <span className="badge-tag">Rewrite correctly</span>
              </div>
              <div className="subject-pill">
                {currentSent.emoji} {currentSent.subject}
              </div>
            </div>

            {/* 插图展示区 */}
            <div className="statement-visual-box">
              <ActionImage 
                src={currentSent.image} 
                alt={currentSent.corrected} 
                emoji={currentSent.emoji} 
                className="statement-img" 
              />
              <div className="visual-caption">
                {currentSent.scienceTip}
              </div>
            </div>

            {/* 作业纸仿真展示区 */}
            {currentSent.namingPart ? (
              <div className="candy-worksheet-simulation">
                <div className="candy-wrapper-banner">
                  <div className="candy-wrapper-title">
                    <span className="candy-wrapper-icon">{currentSent.candyEmoji}</span>
                    <strong>{currentSent.colorName}糖果纸：3-Part 三段式造句拼图</strong>
                  </div>
                  <div className="candy-parts-row">
                    <div className="candy-part-box naming">
                      <span className="part-type-label">1. naming part (谁)</span>
                      <strong className="part-text">{currentSent.namingPart}</strong>
                    </div>
                    <span className="part-plus">+</span>
                    <div className="candy-part-box action">
                      <span className="part-type-label">2. action (动作)</span>
                      <strong className="part-text">{currentSent.actionPart}</strong>
                    </div>
                    <span className="part-plus">+</span>
                    <div className="candy-part-box where-when">
                      <span className="part-type-label">3. where/when (地点/时间)</span>
                      <strong className="part-text">{currentSent.whereWhenPart}</strong>
                    </div>
                  </div>
                </div>
              </div>
            ) : currentSent.sheepWords ? (
              <div className="sheep-worksheet-simulation">
                <div className="sheep-cloud-figure">
                  <span className="sheep-badge-avatar">🐑</span>
                  <div className="sheep-wool-bubble">
                    <span className="sheep-wool-text">{currentSent.sheepWords}</span>
                  </div>
                </div>
                <div className="sheep-writing-rule-guide">
                  <span className="guide-arrow">👉 改写首字母大写：</span>
                  <span className={`guide-target-word ${isCapitalized ? 'magic-active' : ''}`}>
                    {isCapitalized ? currentSent.capitalWord : '__________'}
                  </span>
                  <span className="guide-rest-part">{currentSent.rawRest}</span>
                </div>
              </div>
            ) : (
              /* 原句与错误诊断提示 (青蛙蟾蜍作业) */
              <div className="raw-sentence-box">
                <div className="box-label">
                  <span className="label-icon">⚠️</span>
                  <span>作业纸上的未改写原句（点击单词查释义）：</span>
                </div>
                <div className="raw-sentence-text">
                  <InteractiveSentence text={currentSent.raw} onWordClick={handleWordClick} />
                  {!currentSent.hasPeriod && <span className="missing-period-tag">[缺少句号]</span>}
                </div>
              </div>
            )}

            {/* 魔法修改互动按键 */}
            <div className="magic-action-bar">
              <button 
                className={`magic-btn capital-magic-btn ${isCapitalized ? 'applied' : ''}`}
                onClick={handleApplyCapital}
              >
                {isCapitalized ? `✅ 已大写 (${currentSent.capitalChar})` : `🔠 施放大写魔法 (首字母变 "${currentSent.capitalChar}")`}
              </button>

              <button 
                className={`magic-btn period-magic-btn ${hasPeriodAdded || currentSent.hasPeriod ? 'applied' : ''}`}
                onClick={handleApplyPeriod}
              >
                {currentSent.hasPeriod ? '✅ 句末标点齐全 (.)' : (hasPeriodAdded ? '✅ 句号已加上 (.)' : '🔴 施放句号魔法 (句末加 ".")')}
              </button>

              <button 
                className="magic-btn quick-all-btn"
                onClick={handleApplyAll}
              >
                ✨ 一键规范并朗读
              </button>
            </div>

            {/* 四线三格规范字帖展示区 */}
            <div className="four-lines-board">
              <div className="board-header">
                <span className="board-title">📝 规范铅笔字帖（在你的作业纸横线上照着写）：</span>
                <button 
                  className="read-sentence-btn"
                  onClick={() => { playPop(); speakEnglish(currentSent.corrected, false); }}
                >
                  🔊 听整句标准朗读
                </button>
                <button 
                  className="read-sentence-btn slow"
                  onClick={() => { playPop(); speakEnglish(currentSent.corrected, true); }}
                >
                  🐢 慢速跟读
                </button>
              </div>

              {/* 四线格大字展示 */}
              <div className="handwriting-display">
                <div className="grid-bg-lines">
                  <div className="hl hl-1"></div>
                  <div className="hl hl-2"></div>
                  <div className="hl hl-3"></div>
                  <div className="hl hl-4"></div>
                </div>

                <div className="handwriting-text">
                  <span className={`hw-first ${isCapitalized ? 'magic-active' : ''}`}>
                    {isCapitalized ? currentSent.capitalChar : currentSent.rawFirstChar}
                  </span>
                  <span className="hw-body">
                    {currentSent.corrected.slice(1, currentSent.corrected.endsWith('.') ? -1 : undefined)}
                  </span>
                  <span className={`hw-period ${hasPeriodAdded || currentSent.hasPeriod ? 'magic-active' : ''}`}>
                    .
                  </span>
                </div>
              </div>

              {/* 可交互点读单词条 */}
              <div className="interactive-sentence-strip">
                <span className="strip-hint">👆 点击单词查音标释义：</span>
                <InteractiveSentence text={currentSent.corrected} onWordClick={handleWordClick} />
              </div>

              <div className="sentence-cn-translation">
                <strong>中文含义：</strong> {currentSent.translation}
              </div>

              {/* 铅笔书写小技巧 */}
              <div className="pencil-guide-note">
                <span className="guide-icon">✏️</span>
                <span>{currentSent.pencilGuide}</span>
              </div>
            </div>

            {/* 重点词汇点读条 */}
            <div className="sentence-keywords-bar">
              <span className="bar-label">📖 重点词汇速查卡（点击查看音标与释义）：</span>
              {currentSent.keyWords.map((kw, i) => (
                <button 
                  key={i} 
                  className="keyword-chip"
                  onClick={() => handleWordClick(kw.en)}
                  title={`点击查看 "${kw.en}" 音标与中英释义`}
                >
                  📖 <strong>{kw.en}</strong> ({kw.cn})
                </button>
              ))}
            </div>
          </div>

          {/* 翻页切换控制器 */}
          <div className="pagination-bar">
            <button 
              className="page-btn prev-btn"
              disabled={currentSentIdx === 0}
              onClick={() => { playPop(); setCurrentSentIdx(prev => prev - 1); }}
            >
              👈 上一题
            </button>

            <div className="dots-indicator">
              {sentences.map((s, idx) => (
                <button 
                  key={s.id}
                  className={`dot-pill ${idx === currentSentIdx ? 'active' : ''}`}
                  onClick={() => { playPop(); setCurrentSentIdx(idx); }}
                >
                  第 {s.num} 题 {s.emoji}
                </button>
              ))}
            </div>

            <button 
              className="page-btn next-btn"
              disabled={currentSentIdx === sentences.length - 1}
              onClick={() => { playPop(); setCurrentSentIdx(prev => prev + 1); }}
            >
              下一题 👉
            </button>
          </div>
        </div>
      )}

      {/* --- 模式 2：找茬改错与成分拆解闯关 --- */}
      {activeSubTab === 'quiz' && (
        <div className="statements-quiz-section animate-pop">
          {/* 试卷底部拓展题：三段式句子拆解 */}
          {data.threePartAnalyzer && (
            <div className="three-part-analyzer-card animate-pop">
              <div className="analyzer-header">
                <span className="analyzer-badge">💡 试卷底部拓展大挑战 (On another writing page)</span>
                <h4>{data.threePartAnalyzer.prompt}</h4>
                <p className="analyzer-cn-tip">{data.threePartAnalyzer.promptCn}</p>
              </div>

              <div className="target-sentence-hero">
                <span className="target-quote">“</span>
                <InteractiveSentence text={data.threePartAnalyzer.targetSentence} onWordClick={handleWordClick} />
                <span className="target-quote">”</span>
                <button 
                  className="hero-listen-btn"
                  onClick={() => { playPop(); speakEnglish(data.threePartAnalyzer.targetSentence); }}
                >
                  🔊 听整句读音
                </button>
              </div>
              <div className="target-cn-sub">中文释义：{data.threePartAnalyzer.translation}</div>

              <div className="parts-analysis-grid">
                {data.threePartAnalyzer.parts.map((p, idx) => (
                  <div key={idx} className="part-analysis-card">
                    <div className="part-card-top">
                      <span className="part-icon">{p.icon}</span>
                      <strong className="part-name">{p.name}</strong>
                      <span className="part-tag-pill">{p.tag}</span>
                    </div>
                    <div className="part-card-answer">
                      <span className="ans-label">正确填入：</span>
                      <strong className="ans-word">{p.answer}</strong>
                    </div>
                    <div className="part-card-cn">{p.cn}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="quiz-header">
            <h3>{data.theme === 'sweet-sentences' ? '🍬 糖果三段式拼句与改错大挑战！' : (data.theme === 'counting-sheep' ? '🐑 小羊首字母大写挑战：找出句首大写规则！' : '🐸 找茬捉虫大挑战：找出句子哪里忘记了规则！')}</h3>
            <span className="score-pill">⭐ 答对: {quizScore} 题</span>
          </div>

          {sentences[quizIdx] && (
            <div className="statement-quiz-card">
              <div className="quiz-prompt-box">
                <span className="prompt-label">请看下面这句话（第 {sentences[quizIdx].num} 题）：</span>
                <div className="quiz-target-sentence">
                  "{sentences[quizIdx].raw}"
                </div>
                <button 
                  className="quiz-listen-btn"
                  onClick={() => { playPop(); speakEnglish(sentences[quizIdx].corrected); }}
                >
                  🔊 听正确标准读音
                </button>
              </div>

              <div className="quiz-options-list">
                <button 
                  className="quiz-choice-btn"
                  onClick={() => {
                    playCorrect()
                    setQuizFeedback('correct')
                    setQuizScore(prev => prev + 1)
                    setTimeout(() => {
                      setQuizIdx(prev => (prev + 1) % sentences.length)
                      setQuizFeedback(null)
                    }, 1400)
                  }}
                >
                  🌟 开头 "{sentences[quizIdx].rawFirstChar}" 应该大写成 "{sentences[quizIdx].capitalChar}"（{sentences[quizIdx].capitalWord || sentences[quizIdx].capitalChar}），句末必须有标点符号 "."
                </button>

                <button 
                  className="quiz-choice-btn wrong-opt"
                  onClick={() => { playTryAgain(); setQuizFeedback('wrong'); }}
                >
                  ❌ 直接照抄小写形式，句首单词不需要大写
                </button>

                <button 
                  className="quiz-choice-btn wrong-opt"
                  onClick={() => { playTryAgain(); setQuizFeedback('wrong'); }}
                >
                  ❌ 只要句末有句号就行，句首不需要大写
                </button>
              </div>

              {quizFeedback === 'correct' && (
                <div className="feedback-banner correct-banner animate-bounce">
                  🎉 太聪明了！首字母必须大写，句末必须加句号！加一颗星星 ⭐
                </div>
              )}
              {quizFeedback === 'wrong' && (
                <div className="feedback-banner wrong-banner">
                  💡 仔细想一想：句首字母要怎样？句子结束要加什么标点？
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* --- 模式 3：3句话小作文指导工作坊 (On another piece of paper) --- */}
      {activeSubTab === 'writing' && (
        <div className="writing-workshop-section animate-pop">
          <div className="workshop-header-banner">
            <div className="banner-icon-box">📝</div>
            <div className="banner-text-box">
              <h3>{writingTask.title}</h3>
              <p><strong>老师要求：</strong>{writingTask.promptCn}</p>
            </div>
          </div>

          {/* 写作三步法秘诀 */}
          <div className="writing-steps-grid">
            {writingTask.tips && writingTask.tips.map((tip, idx) => (
              <div key={idx} className="step-tip-card">
                <div className="step-num">Step {idx + 1}</div>
                <div className="step-text">{tip}</div>
              </div>
            ))}
          </div>

          {/* 范例小卡片切换 */}
          <div className="samples-container">
            <div className="samples-helper-pill">
              💡 提示：示范作文中的所有单词均可直接点击，查阅音标、慢速发音与中英文详细解释！
            </div>
            <div className="samples-nav">
              <span className="samples-label">精选优秀示范作文（在纸上可直接借鉴）：</span>
              {writingTask.samples && writingTask.samples.map((s, idx) => (
                <button 
                  key={s.id}
                  className={`sample-tab-btn ${idx === activeSampleIdx ? 'active' : ''}`}
                  onClick={() => { playPop(); setActiveSampleIdx(idx); }}
                >
                  {s.name}
                </button>
              ))}
            </div>

            {writingTask.samples && writingTask.samples[activeSampleIdx] && (
              <div className="sample-card-body animate-pop">
                {writingTask.samples[activeSampleIdx].bookTitle && (
                  <div className="sample-book-badge">
                    <span className="sample-book-title">📚 推荐经典绘本：<strong>{writingTask.samples[activeSampleIdx].bookTitle}</strong></span>
                    {writingTask.samples[activeSampleIdx].capitalLetter && (
                      <span className="circle-cap-tag">⭕ 绘本抄写任务：圈出句首大写字母 <strong>"{writingTask.samples[activeSampleIdx].capitalLetter}"</strong></span>
                    )}
                  </div>
                )}
                <div className="sample-lines-list">
                  {writingTask.samples[activeSampleIdx].lines.map((line, lIdx) => (
                    <div key={lIdx} className="sample-line-item">
                      <div className="line-num-pill">句 {lIdx + 1}</div>
                      <div className="line-content">
                        <div className="line-en">
                          <InteractiveSentence text={line.en} onWordClick={handleWordClick} />
                        </div>
                        <div className="line-cn">{line.cn}</div>
                      </div>
                      <button 
                        className="line-audio-btn"
                        onClick={() => { playPop(); speakEnglish(line.en); }}
                      >
                        🔊 听整句
                      </button>
                    </div>
                  ))}
                </div>

                <div className="sample-all-audio-bar">
                  <button 
                    className="play-all-sample-btn"
                    onClick={() => {
                      const lines = writingTask.samples[activeSampleIdx].lines
                      speakEnglish(lines[0].en, false, () => {
                        setTimeout(() => {
                          speakEnglish(lines[1].en, false, () => {
                            setTimeout(() => {
                              speakEnglish(lines[2].en, false)
                            }, 400)
                          })
                        }, 400)
                      })
                    }}
                  >
                    ▶️ 连续播放三句话完整朗读
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 互动自选拼句板 */}
          <div className="sentence-builder-box">
            <h4>💡 互动造句拼词板（点击选用，助你在纸上流畅动笔）：</h4>
            {writingTask.interactiveStarters && writingTask.interactiveStarters.map((group, gIdx) => (
              <div key={gIdx} className="starter-group">
                <span className="group-label">{group.label}：</span>
                <div className="starter-chips">
                  {group.starters.map((str, sIdx) => (
                    <button 
                      key={sIdx} 
                      className="starter-chip"
                      onClick={() => { playPop(); speakEnglish(str); }}
                    >
                      {str} 🔊
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- 模式 4：核心词汇闪卡 --- */}
      {activeSubTab === 'cards' && (
        <div className="statements-cards-section animate-pop">
          <div className="cards-grid-header">
            <h3>🐸 6 个核心知识词汇闪卡</h3>
            <p>掌握青蛙与蟾蜍的专有英文词汇，点击任意卡片查看发音、音标与释义！</p>
          </div>

          <div className="all-action-cards-grid">
            {words.map((w) => (
              <div 
                key={w.id} 
                className="action-mini-card clickable-dict-card"
                onClick={() => handleWordClick(w.word)}
                title={`点击查看 "${w.word}" 发音、音标与中英文详细解释`}
              >
                <ActionImage src={w.image} alt={w.word} emoji={w.emoji} className="mini-card-img" />
                <div className="mini-card-info">
                  <div className="mini-card-top-line">
                    <span className="mini-emoji">{w.emoji}</span>
                    <strong className="mini-word">{w.word}</strong>
                    {w.phonetic && <span className="mini-phonetic">{w.phonetic}</span>}
                  </div>
                  <div className="mini-card-sub-line">
                    <span className="mini-cn">{w.translation}</span>
                    <span className="mini-lookup-tag">📖 详细释义</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- 模式 5：听音辨句挑战 --- */}
      {activeSubTab === 'listening' && listeningTarget && (
        <div className="listening-quiz-section animate-pop">
          <div className="quiz-header">
            <h3>👂 仔细听录音，找出读的是哪一句英文：</h3>
            <button 
              className="repeat-audio-btn"
              onClick={() => { playPop(); speakEnglish(listeningTarget.corrected); }}
            >
              🔊 再听一遍完整句子
            </button>
            <span className="score-pill">⭐ 答对: {listeningScore} 题</span>
          </div>

          <div className="sentence-options-grid">
            {sentences.map((s) => (
              <div 
                key={s.id}
                className="sentence-opt-card"
                onClick={() => handleListeningAnswer(s)}
              >
                <span className="opt-num">第 {s.num} 题 {s.emoji}</span>
                <strong className="opt-en">{s.corrected}</strong>
                <span className="opt-cn">{s.translation}</span>
              </div>
            ))}
          </div>

          {listeningFeedback === 'correct' && (
            <div className="feedback-banner correct-banner animate-bounce">
              🎉 太棒了！听得真准！加一颗小星星 ⭐
            </div>
          )}
          {listeningFeedback === 'wrong' && (
            <div className="feedback-banner wrong-banner">
              💡 听错啦，点击上方按钮再听一遍哦！
            </div>
          )}
        </div>
      )}

      {/* 底部打卡按钮 */}
      <div className="homework-bottom-bar">
        <button 
          className={`finish-homework-btn ${isCompleted ? 'already-done' : ''}`}
          onClick={() => {
            playCheer()
            onCompleteTask('english')
          }}
        >
          {isCompleted ? '✅ 句子改写与小作文已通关（再次庆祝）' : '🎉 我完成句子改写与小作文啦！打卡领贴纸'}
        </button>
      </div>

      {/* 点击单词弹出发音、音标与释义卡片 */}
      {selectedWordData && (
        <WordDetailModal 
          wordData={selectedWordData} 
          onClose={() => setSelectedWordData(null)} 
        />
      )}
    </div>
  )
}

/**
 * 历史作业：Action Words 动作词剪贴与背诵视图
 */
function ActionWordsHomeworkView({ data, isCompleted, onCompleteTask }) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isAnswerHidden, setIsAnswerHidden] = useState(false)
  const [activeSubTab, setActiveSubTab] = useState('recite') // 'recite' | 'worksheet' | 'cards' | 'quiz'
  
  // 词典卡片弹窗状态
  const [selectedWordData, setSelectedWordData] = useState(null)

  const handleWordClick = (rawWord) => {
    playPop()
    const wordInfo = lookupWord(rawWord)
    if (wordInfo) {
      setSelectedWordData(wordInfo)
    }
  }
  
  // 听音选图题目状态
  const [quizTarget, setQuizTarget] = useState(null)
  const [quizOptions, setQuizOptions] = useState([])
  const [quizFeedback, setQuizFeedback] = useState(null)
  const [quizScore, setQuizScore] = useState(0)

  // 剪贴练习册匹配状态 (Worksheet Match)
  const [selectedWordBankWord, setSelectedWordBankWord] = useState(null)
  const [matchedPairs, setMatchedPairs] = useState({}) // { [wordId]: true }
  const [worksheetFeedback, setWorksheetFeedback] = useState('')

  const words = data.words || []
  const currentWord = words[currentIdx] || words[0]

  useEffect(() => {
    setIsAnswerHidden(false)
  }, [currentIdx])

  // 初始化听音小测试
  const initQuiz = () => {
    if (words.length === 0) return
    const target = words[Math.floor(Math.random() * words.length)]
    setQuizTarget(target)
    const shuffled = [...words].sort(() => 0.5 - Math.random()).slice(0, 4)
    if (!shuffled.some(w => w.id === target.id)) {
      shuffled[0] = target
      shuffled.sort(() => 0.5 - Math.random())
    }
    setQuizOptions(shuffled)
    setQuizFeedback(null)
    speakEnglish(target.sentence || `What is ${target.gender} doing? ${target.gender === 'he' ? 'He' : 'She'} is ${target.word}.`)
  }

  useEffect(() => {
    if (activeSubTab === 'quiz') {
      initQuiz()
    }
  }, [activeSubTab])

  // 答题
  const handleQuizChoice = (wordObj) => {
    if (wordObj.id === quizTarget.id) {
      playCorrect()
      setQuizFeedback('correct')
      setQuizScore(prev => prev + 1)
      setTimeout(() => {
        initQuiz()
      }, 1300)
    } else {
      playTryAgain()
      setQuizFeedback('wrong')
    }
  }

  // 剪贴作业点击图片配对
  const handleMatchPicture = (targetWord) => {
    if (!selectedWordBankWord) {
      playPop()
      speakEnglish(`What is ${targetWord.gender} doing?`)
      return
    }

    if (selectedWordBankWord.id === targetWord.id) {
      playCorrect()
      setMatchedPairs(prev => ({ ...prev, [targetWord.id]: true }))
      setSelectedWordBankWord(null)
      setWorksheetFeedback(`🎉 贴对啦！${targetWord.word}！`)
      speakEnglish(`${targetWord.gender === 'he' ? 'He' : 'She'} is ${targetWord.word}.`)
      setTimeout(() => setWorksheetFeedback(''), 2000)
    } else {
      playTryAgain()
      setWorksheetFeedback(`💡 哎呀，再看仔细哦，这不是 ${selectedWordBankWord.word} 呢`)
      setTimeout(() => setWorksheetFeedback(''), 2000)
    }
  }

  // 朗读问句与答句
  const handlePlayQA = (wordObj, isSlow = false) => {
    stopSpeech()
    playPop()
    const q = `What is ${wordObj.gender} doing?`
    const a = `${wordObj.gender === 'he' ? 'He' : 'She'} is ${wordObj.word}.`
    speakEnglish(q, isSlow, () => {
      setTimeout(() => {
        speakEnglish(a, isSlow)
      }, 400)
    })
  }

  return (
    <div className="english-view">
      {/* 顶部二级导航 */}
      <div className="sub-nav-bar">
        <button 
          className={`sub-tab-btn ${activeSubTab === 'recite' ? 'active' : ''}`}
          onClick={() => { playPop(); setActiveSubTab('recite'); }}
        >
          🗣️ 问答口语背诵秀 ({currentIdx + 1}/{words.length})
        </button>

        <button 
          className={`sub-tab-btn ${activeSubTab === 'worksheet' ? 'active' : ''}`}
          onClick={() => { playPop(); setActiveSubTab('worksheet'); }}
        >
          ✂️ 剪贴配对做作业 ({Object.keys(matchedPairs).length}/{words.length})
        </button>

        <button 
          className={`sub-tab-btn ${activeSubTab === 'cards' ? 'active' : ''}`}
          onClick={() => { playPop(); setActiveSubTab('cards'); }}
        >
          🗂️ 16个动作词全景闪卡
        </button>

        <button 
          className={`sub-tab-btn ${activeSubTab === 'quiz' ? 'active' : ''}`}
          onClick={() => { playPop(); setActiveSubTab('quiz'); }}
        >
          👂 听音选图小挑战
        </button>
      </div>

      {/* --- 模式 1：重点背诵剧场 "What is he/she doing?" --- */}
      {activeSubTab === 'recite' && currentWord && (
        <div className="recite-stage-container">
          <div className="recite-banner-tip">
            <span className="tip-badge">📢 明天课堂重点分享</span>
            <p>老师要求在家练习背诵：<strong>"What is he/she doing?"</strong> → <strong>"He/She is ...ing."</strong></p>
          </div>

          <div className="recite-main-card">
            {/* 动作插图 */}
            <div className="recite-image-box">
              <ActionImage src={currentWord.image} alt={currentWord.word} emoji={currentWord.emoji} className="recite-img" />
              <div className="recite-emoji-tag">{currentWord.emoji}</div>
              <div className="recite-action-tag">动作：{currentWord.translation}</div>
            </div>

            {/* 问答对话气泡 */}
            <div className="dialogue-bubbles-wrap">
              {/* 老师/家长的提问气泡 */}
              <div className="bubble-row question-bubble-row">
                <div className="avatar-tag">👩‍🏫 问：</div>
                <div className="bubble-box question-bubble">
                  <div className="bubble-en">"What is {currentWord.gender} doing?"</div>
                  <div className="bubble-cn">{currentWord.gender === 'he' ? '他在做什么？' : '她在做什么？'}</div>
                  <button 
                    className="bubble-audio-btn"
                    onClick={() => { playPop(); speakEnglish(`What is ${currentWord.gender} doing?`); }}
                  >
                    🔊 听问句
                  </button>
                </div>
              </div>

              {/* 小朋友的回答背诵气泡 */}
              <div className="bubble-row answer-bubble-row">
                <div className="avatar-tag">👧 答：</div>
                <div className="bubble-box answer-bubble">
                  {isAnswerHidden ? (
                    <div className="answer-mask-box" onClick={() => { playMagic(); setIsAnswerHidden(false); }}>
                      <span className="mask-title">✨ 大声背出来考考自己 ✨</span>
                      <span className="mask-sub">想一想：{currentWord.gender === 'he' ? 'He is ...' : 'She is ...'}（点击揭晓答案）</span>
                    </div>
                  ) : (
                    <>
                      <div className="bubble-en highlight-en">
                        "{currentWord.gender === 'he' ? 'He' : 'She'} is{' '}
                        <strong 
                          className="action-bold clickable-word-token"
                          onClick={() => handleWordClick(currentWord.word)}
                          title="点击查看音标与中英释义"
                        >
                          {currentWord.word}
                        </strong>."
                      </div>
                      <div className="bubble-cn">
                        {currentWord.gender === 'he' ? '他' : '她'}正在{currentWord.translation}。
                      </div>
                    </>
                  )}

                  <div className="answer-action-btns">
                    <button 
                      className="answer-audio-btn normal"
                      onClick={() => { playPop(); speakEnglish(`${currentWord.gender === 'he' ? 'He' : 'She'} is ${currentWord.word}.`, false); }}
                    >
                      🔊 听回答原速
                    </button>
                    <button 
                      className="answer-audio-btn slow"
                      onClick={() => { playPop(); speakEnglish(`${currentWord.gender === 'he' ? 'He' : 'She'} is ${currentWord.word}.`, true); }}
                    >
                      🐢 乌龟慢速跟读
                    </button>
                    <button 
                      className="answer-audio-btn lookup-btn"
                      onClick={() => handleWordClick(currentWord.word)}
                      title="查看音标与释义"
                    >
                      📖 查词典与音标
                    </button>
                    <button 
                      className={`peek-answer-btn ${isAnswerHidden ? 'active' : ''}`}
                      onClick={() => {
                        playMagic()
                        setIsAnswerHidden(!isAnswerHidden)
                      }}
                    >
                      {isAnswerHidden ? '👀 看看答案' : '🙈 遮住我自己背'}
                    </button>
                  </div>
                </div>
              </div>

              {/* 连贯对话自动朗读 */}
              <div className="full-qa-bar">
                <button 
                  className="full-qa-play-btn"
                  onClick={() => handlePlayQA(currentWord, false)}
                >
                  ▶️ 连续播放完整问答对话
                </button>
              </div>
            </div>
          </div>

          {/* 切换下一个动作 */}
          <div className="pagination-bar">
            <button 
              className="page-btn prev-btn"
              disabled={currentIdx === 0}
              onClick={() => { playPop(); setCurrentIdx(prev => prev - 1); }}
            >
              👈 上一个动作
            </button>

            <div className="dots-indicator">
              {words.map((w, idx) => (
                <button 
                  key={w.id}
                  className={`dot-pill ${idx === currentIdx ? 'active' : ''}`}
                  onClick={() => { playPop(); setCurrentIdx(idx); }}
                  title={w.word}
                >
                  {w.emoji}
                </button>
              ))}
            </div>

            <button 
              className="page-btn next-btn"
              disabled={currentIdx === words.length - 1}
              onClick={() => { playPop(); setCurrentIdx(prev => prev + 1); }}
            >
              下一个动作 👉
            </button>
          </div>
        </div>
      )}

      {/* --- 模式 2：剪贴练习册模拟配对 --- */}
      {activeSubTab === 'worksheet' && (
        <div className="worksheet-match-section">
          <div className="worksheet-instructions">
            <h3>✂️ 练习册互动剪贴区：Identify the Action Verb</h3>
            <p>第一步：点击下方 <strong>Word Bank</strong> 里的动作词；第二步：点击上方对应的图片，把它“贴”上去！</p>
            {worksheetFeedback && (
              <div className="worksheet-toast-banner animate-pop">{worksheetFeedback}</div>
            )}
          </div>

          {/* 16 个图片格子（对应老师的作业纸） */}
          <div className="worksheet-grid">
            {words.map((w) => {
              const isPasted = !!matchedPairs[w.id]
              return (
                <div 
                  key={w.id} 
                  className={`worksheet-slot ${isPasted ? 'pasted' : ''}`}
                  onClick={() => handleMatchPicture(w)}
                >
                  <div className="slot-img-wrap">
                    <ActionImage src={w.image} alt={w.word} emoji={w.emoji} className="slot-img" />
                    <span className="slot-emoji">{w.emoji}</span>
                  </div>

                  <div className="slot-paste-area">
                    {isPasted ? (
                      <span className="pasted-badge animate-bounce">
                        ✅ {w.word}
                      </span>
                    ) : (
                      <span className="paste-dashed-line">
                        {selectedWordBankWord ? '👇 点我贴上' : '剪贴虚线框'}
                      </span>
                    )}
                  </div>
                  <span className="slot-cn-hint">{w.translation}</span>
                </div>
              )
            })}
          </div>

          {/* Word Bank 剪贴词库 */}
          <div className="word-bank-container">
            <div className="word-bank-header">
              <span className="scissors-icon">✂️</span>
              <h4>Word Bank 待剪贴词库（点击选择一个词，再去贴图）：</h4>
            </div>

            <div className="word-bank-chips">
              {words.map((w) => {
                const isUsed = !!matchedPairs[w.id]
                const isSelected = selectedWordBankWord?.id === w.id
                return (
                  <button 
                    key={w.id}
                    className={`bank-chip ${isUsed ? 'used' : ''} ${isSelected ? 'selected' : ''}`}
                    disabled={isUsed}
                    onClick={() => {
                      playPop()
                      setSelectedWordBankWord(w)
                      speakEnglish(w.word)
                    }}
                  >
                    {isUsed ? `✂️ 已贴好 (${w.word})` : `${w.emoji} ${w.word}`}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* --- 模式 3：16个动作词全景闪卡 --- */}
      {activeSubTab === 'cards' && (
        <div className="all-cards-grid-section">
          <div className="cards-grid-header">
            <h3>📖 16 个 Action Words 全景图文表</h3>
            <p>掌握动作词汇，点击任意卡片查看纯正发音、音标与详细解释！</p>
          </div>

          <div className="all-action-cards-grid">
            {words.map((w) => (
              <div 
                key={w.id} 
                className="action-mini-card clickable-dict-card"
                onClick={() => handleWordClick(w.word)}
                title={`点击查看 "${w.word}" 发音、音标与中英文详细解释`}
              >
                <ActionImage src={w.image} alt={w.word} emoji={w.emoji} className="mini-card-img" />
                <div className="mini-card-info">
                  <div className="mini-card-top-line">
                    <span className="mini-emoji">{w.emoji}</span>
                    <strong className="mini-word">{w.word}</strong>
                    {w.phonetic && <span className="mini-phonetic">{w.phonetic}</span>}
                  </div>
                  <div className="mini-card-sub-line">
                    <span className="mini-cn">{w.translation}</span>
                    <span className="mini-lookup-tag">📖 详细释义</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- 模式 4：听音选图测试 --- */}
      {activeSubTab === 'quiz' && quizTarget && (
        <div className="quiz-section">
          <div className="quiz-header">
            <h3>👂 听一听，选出老师读的动作图片：</h3>
            <button 
              className="repeat-audio-btn"
              onClick={() => { playPop(); speakEnglish(quizTarget.sentence); }}
            >
              🔊 再听一遍完整句子
            </button>
            <span className="score-pill">⭐ 答对: {quizScore} 题</span>
          </div>

          <div className="quiz-options-grid">
            {quizOptions.map((opt) => (
              <div 
                key={opt.id} 
                className="quiz-option-card"
                onClick={() => handleQuizChoice(opt)}
              >
                <ActionImage src={opt.image} alt={opt.word} emoji={opt.emoji} className="quiz-opt-img" />
                <span className="quiz-opt-label">{opt.emoji} {opt.translation}</span>
                <span className="quiz-opt-word">{opt.word}</span>
              </div>
            ))}
          </div>

          {quizFeedback === 'correct' && (
            <div className="feedback-banner correct-banner animate-bounce">
              🎉 太棒了！选对啦！{quizTarget.word}！加一颗小星星 ⭐
            </div>
          )}
          {quizFeedback === 'wrong' && (
            <div className="feedback-banner wrong-banner">
              💡 听错啦，仔细听一听正在做哪个动作哦！
            </div>
          )}
        </div>
      )}

      {/* 底部打卡按钮 */}
      <div className="homework-bottom-bar">
        <button 
          className={`finish-homework-btn ${isCompleted ? 'already-done' : ''}`}
          onClick={() => {
            playCheer()
            onCompleteTask('english')
          }}
        >
          {isCompleted ? '✅ Action Words 作业已通关（再次庆祝）' : '🎉 我会背诵问答了！打卡领贴纸'}
        </button>
      </div>

      {/* 点击单词弹出发音、音标与释义卡片 */}
      {selectedWordData && (
        <WordDetailModal 
          wordData={selectedWordData} 
          onClose={() => setSelectedWordData(null)} 
        />
      )}
    </div>
  )
}
