import React, { useState } from 'react'
import { speakPinyinBaidu } from '../utils/speech'
import { playPop, playCorrect, playMagic, playCheer, playTryAgain } from '../utils/sound'

export function PinyinHomework({ data, isCompleted, onCompleteTask }) {
  const [activeSubTab, setActiveSubTab] = useState('cards') // 'cards' | 'blend' | 'quiz'
  const [currentLetterIdx, setCurrentLetterIdx] = useState(0)
  
  // 拼读碰碰乐状态
  const [currentBlendIdx, setCurrentBlendIdx] = useState(0)
  const [isColliding, setIsColliding] = useState(false)
  const [hasCollided, setHasCollided] = useState(false)

  // 听音辨拼音状态
  const [quizLetter, setQuizLetter] = useState(null)
  const [quizScore, setQuizScore] = useState(0)
  const [quizFeedback, setQuizFeedback] = useState(null)

  const currentLetter = data.letters[currentLetterIdx] || data.letters[0]
  const currentBlend = data.blends[currentBlendIdx] || data.blends[0]

  // 切换到指定字母卡并自动真人发音
  const selectLetter = (idx) => {
    playPop()
    setCurrentLetterIdx(idx)
    const target = data.letters[idx]
    if (target) {
      speakPinyinBaidu(target.char)
    }
  }

  // 声韵碰一碰动画触发
  const handleTriggerBlend = () => {
    playMagic()
    setIsColliding(true)
    setHasCollided(false)
    setTimeout(() => {
      setIsColliding(false)
      setHasCollided(true)
      playCorrect()
      // 百度真人朗读拼读过程：如 玻……啊……八！八只鸭子
      speakPinyinBaidu(`blend_${currentBlend.id}`)
    }, 600)
  }

  // 听音选拼音出题
  const initQuiz = () => {
    const target = data.letters[Math.floor(Math.random() * data.letters.length)]
    setQuizLetter(target)
    setQuizFeedback(null)
    speakPinyinBaidu(target.char)
  }

  const handleQuizAnswer = (letterObj) => {
    if (letterObj.id === quizLetter.id) {
      playCorrect()
      setQuizFeedback('correct')
      setQuizScore(prev => prev + 1)
      setTimeout(() => {
        initQuiz()
      }, 1200)
    } else {
      playTryAgain()
      setQuizFeedback('wrong')
      // 读出孩子误选的字母，辅助对比辩音
      speakPinyinBaidu(letterObj.char)
    }
  }

  return (
    <div className="pinyin-view">
      {/* 顶部二级导航 */}
      <div className="sub-nav-bar">
        <button 
          className={`sub-tab-btn ${activeSubTab === 'cards' ? 'active' : ''}`}
          onClick={() => { 
            playPop()
            setActiveSubTab('cards')
            speakPinyinBaidu(currentLetter.char)
          }}
        >
          🗂️ 拼音字母认读 ({currentLetterIdx + 1}/{data.letters.length})
        </button>

        <button 
          className={`sub-tab-btn ${activeSubTab === 'blend' ? 'active' : ''}`}
          onClick={() => { playPop(); setActiveSubTab('blend'); }}
        >
          🚀 声韵拼读碰碰乐
        </button>

        <button 
          className={`sub-tab-btn ${activeSubTab === 'quiz' ? 'active' : ''}`}
          onClick={() => { 
            playPop()
            setActiveSubTab('quiz')
            initQuiz()
          }}
        >
          👂 听音选拼音小测验
        </button>
      </div>

      {/* --- 模式 1：拼音卡片认读（四线三格大展示） --- */}
      {activeSubTab === 'cards' && (
        <div className="pinyin-cards-section">
          <div className="pinyin-stage-card">
            {/* 四线三格视觉背景 */}
            <div className="four-lines-grid">
              <div className="grid-line line-1"></div>
              <div className="grid-line line-2"></div>
              <div className="grid-line line-3"></div>
              <div className="grid-line line-4"></div>
              
              <div 
                className="pinyin-char-display animate-pop"
                style={{ cursor: 'pointer' }}
                title="点击听百度真人发音"
                onClick={() => { playPop(); speakPinyinBaidu(currentLetter.char); }}
              >
                {currentLetter.char}
              </div>
            </div>

            <div className="pinyin-badge-row">
              <span className="pinyin-type-tag">{currentLetter.type}</span>
              <span className="baidu-voice-tag" style={{
                background: 'linear-gradient(135deg, #e0f2fe, #bae6fd)',
                color: '#0284c7',
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 'bold',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                border: '1px solid #7dd3fc'
              }}>
                🎙️ 百度真人发音
              </span>
            </div>

            {/* 记忆顺口溜 */}
            <div className="mnemonic-box">
              <span className="mnemonic-icon">💡 记忆顺口溜：</span>
              <p className="mnemonic-text">{currentLetter.mnemonic}</p>
            </div>

            {/* 发音口型提示 */}
            <div className="sound-tip-box">
              <span className="tip-icon">👄 口型小秘诀：</span>
              <span className="tip-text">{currentLetter.soundTip}</span>
            </div>

            {/* 发音按钮 */}
            <div className="pinyin-voice-controls">
              <button 
                className="speech-btn normal-speed-btn"
                onClick={() => { playPop(); speakPinyinBaidu(currentLetter.char); }}
              >
                🔊 百度真人发音
              </button>
              <button 
                className="speech-btn slow-speed-btn"
                onClick={() => { playPop(); speakPinyinBaidu(currentLetter.char, true); }}
              >
                🐢 慢速跟着读
              </button>
            </div>
          </div>

          {/* 翻页切换控制器 */}
          <div className="pagination-bar">
            <button 
              className="page-btn prev-btn"
              disabled={currentLetterIdx === 0}
              onClick={() => selectLetter(currentLetterIdx - 1)}
            >
              👈 上一个字母
            </button>

            <div className="dots-indicator">
              {data.letters.map((p, idx) => (
                <button 
                  key={p.id}
                  className={`dot-pill ${idx === currentLetterIdx ? 'active' : ''}`}
                  onClick={() => selectLetter(idx)}
                >
                  {p.char}
                </button>
              ))}
            </div>

            <button 
              className="page-btn next-btn"
              disabled={currentLetterIdx === data.letters.length - 1}
              onClick={() => selectLetter(currentLetterIdx + 1)}
            >
              下一个字母 👉
            </button>
          </div>
        </div>
      )}

      {/* --- 模式 2：声韵拼读碰碰乐 --- */}
      {activeSubTab === 'blend' && (
        <div className="blend-section">
          <div className="blend-arena">
            <h3 className="blend-title">🎈 声母韵母碰碰碰，拼出新音节！</h3>
            <p className="blend-subtitle">把声母和带调韵母合在一起，看看它能拼出什么词？</p>

            <div className="blend-stage">
              {/* 左侧声母 */}
              <div 
                className={`blend-block initial-block ${isColliding ? 'collide-right' : ''}`}
                style={{ cursor: 'pointer' }}
                title="点击听发音"
                onClick={() => { playPop(); speakPinyinBaidu(currentBlend.initial); }}
              >
                <span className="block-label">声母</span>
                <span className="block-char">{currentBlend.initial}</span>
              </div>

              <div className="blend-operator">+</div>

              {/* 右侧韵母 */}
              <div 
                className={`blend-block final-block ${isColliding ? 'collide-left' : ''}`}
                style={{ cursor: 'pointer' }}
                title="点击听发音"
                onClick={() => { playPop(); speakPinyinBaidu(currentBlend.final); }}
              >
                <span className="block-label">韵母</span>
                <span className="block-char">{currentBlend.final}</span>
              </div>

              <div className="blend-operator">=</div>

              {/* 拼出结果 */}
              <div 
                className={`blend-block result-block ${hasCollided ? 'show-result animate-bounce' : ''}`}
                style={{ cursor: hasCollided ? 'pointer' : 'default' }}
                title={hasCollided ? '点击听发音' : ''}
                onClick={() => {
                  if (hasCollided) {
                    playPop()
                    speakPinyinBaidu(`word_${currentBlend.id}`)
                  }
                }}
              >
                <span className="block-label">拼读音节</span>
                <span className="block-char">{hasCollided ? currentBlend.result : '❓'}</span>
              </div>
            </div>

            {/* 碰撞触发按钮 */}
            <div className="blend-action-row">
              <button className="trigger-blend-btn" onClick={handleTriggerBlend}>
                🚀 碰一碰，拼出来！
              </button>
            </div>

            {/* 拼读结果说明与例词 */}
            {hasCollided && (
              <div className="blend-success-box animate-pop">
                <div className="blend-word-display">
                  <span className="word-pinyin">{currentBlend.result}</span>
                  <span className="word-text">{currentBlend.word}</span>
                </div>
                <div className="blend-example">
                  生活常说：<span>{currentBlend.example}</span>
                </div>
                <button 
                  className="repeat-blend-speech-btn"
                  onClick={() => { playPop(); speakPinyinBaidu(`word_${currentBlend.id}`); }}
                >
                  🔊 百度真人朗读例词
                </button>
              </div>
            )}

            {/* 切换拼读音节 */}
            <div className="blend-selector-row">
              <span className="selector-title">切换练习：</span>
              {data.blends.map((b, idx) => (
                <button 
                  key={b.id}
                  className={`blend-pill-btn ${idx === currentBlendIdx ? 'active' : ''}`}
                  onClick={() => {
                    playPop()
                    setCurrentBlendIdx(idx)
                    setHasCollided(false)
                  }}
                >
                  {b.initial} + {b.final} → {b.result}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- 模式 3：听音辨拼音 --- */}
      {activeSubTab === 'quiz' && quizLetter && (
        <div className="pinyin-quiz-section">
          <div className="quiz-header">
            <h3>👂 仔细听读音，找出对应的拼音字母：</h3>
            <button 
              className="repeat-audio-btn"
              onClick={() => { playPop(); speakPinyinBaidu(quizLetter.char); }}
            >
              🔊 百度真人再读一遍
            </button>
            <span className="score-pill">⭐ 答对: {quizScore} 题</span>
          </div>

          <div className="pinyin-options-grid">
            {data.letters.map((letObj) => (
              <button 
                key={letObj.id}
                className="pinyin-opt-card"
                onClick={() => handleQuizAnswer(letObj)}
              >
                <span className="opt-char">{letObj.char}</span>
                <span className="opt-type">{letObj.type}</span>
              </button>
            ))}
          </div>

          {quizFeedback === 'correct' && (
            <div className="feedback-banner correct-banner animate-bounce">
              🎉 太厉害了！拼音认得真准！加一颗小星星 ⭐
            </div>
          )}
          {quizFeedback === 'wrong' && (
            <div className="feedback-banner wrong-banner">
              💡 听错啦，仔细听刚刚读的音哦！
            </div>
          )}
        </div>
      )}

      {/* 底部打卡完成按钮 */}
      <div className="homework-bottom-bar">
        <button 
          className={`finish-homework-btn ${isCompleted ? 'already-done' : ''}`}
          onClick={() => {
            playCheer()
            onCompleteTask('pinyin')
          }}
        >
          {isCompleted ? '✅ 拼音作业已完成（点击重新庆祝）' : '🎉 我学会拼音啦！打卡领贴纸'}
        </button>
      </div>
    </div>
  )
}
