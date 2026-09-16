import React, { useState, useEffect } from 'react'
import { speakEnglish, stopSpeech } from '../utils/speech'
import { playPop, playCorrect, playTryAgain, playMagic, playCheer } from '../utils/sound'

export function EnglishHomework({ data, isCompleted, onCompleteTask }) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isAnswerHidden, setIsAnswerHidden] = useState(false)
  const [activeSubTab, setActiveSubTab] = useState('recite') // 'recite' | 'worksheet' | 'cards' | 'quiz'
  
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
              <img src={currentWord.image} alt={currentWord.word} className="recite-img" />
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
                        "{currentWord.gender === 'he' ? 'He' : 'She'} is <strong className="action-bold">{currentWord.word}</strong>."
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
                    <img src={w.image} alt={w.word} className="slot-img" />
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
            <p>点击任意卡片听纯正发音，提前复习不卡壳！</p>
          </div>

          <div className="all-action-cards-grid">
            {words.map((w) => (
              <div 
                key={w.id} 
                className="action-mini-card"
                onClick={() => {
                  playPop()
                  speakEnglish(w.word)
                }}
              >
                <img src={w.image} alt={w.word} className="mini-card-img" />
                <div className="mini-card-info">
                  <span className="mini-emoji">{w.emoji}</span>
                  <strong className="mini-word">{w.word}</strong>
                  <span className="mini-cn">{w.translation}</span>
                  <button className="mini-sound-btn" title="播放发音">🔊</button>
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
                <img src={opt.image} alt={opt.word} className="quiz-opt-img" />
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
    </div>
  )
}
