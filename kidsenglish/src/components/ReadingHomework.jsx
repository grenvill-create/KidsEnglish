import React, { useState } from 'react'
import { speakChinese, stopSpeech } from '../utils/speech'
import { playPop, playCorrect, playMagic, playCheer } from '../utils/sound'

export function ReadingHomework({ data, isCompleted, onCompleteTask }) {
  const [activeLineIdx, setActiveLineIdx] = useState(null)
  const [isReadingAll, setIsReadingAll] = useState(false)
  const [isHideChars, setIsHideChars] = useState(false) // 遮字看拼音背诵模式
  const [isRecited, setIsRecited] = useState(false)
  const [imgError, setImgError] = useState(false)

  React.useEffect(() => {
    setImgError(false)
  }, [data.image])

  // 朗读单行
  const handleReadLine = (lineIdx) => {
    stopSpeech()
    playPop()
    setActiveLineIdx(lineIdx)
    const text = data.lines[lineIdx].map(item => item.char).join('')
    speakChinese(text, false, () => {
      setActiveLineIdx(null)
    })
  }

  // 顺序连贯朗读全篇
  const handleReadAll = () => {
    stopSpeech()
    playMagic()
    setIsReadingAll(true)
    let current = 0

    const readNext = () => {
      if (current >= data.lines.length) {
        setIsReadingAll(false)
        setActiveLineIdx(null)
        playCorrect()
        return
      }
      setActiveLineIdx(current)
      const text = data.lines[current].map(item => item.char).join('')
      current++
      speakChinese(text, false, readNext)
    }

    readNext()
  }

  // 单字点击朗读
  const handleCharClick = (char) => {
    if (!char || char === '，' || char === '。' || char === '！' || char === '？') return
    playPop()
    speakChinese(char)
  }

  return (
    <div className="reading-view">
      {/* 顶部绘本舞台卡片 */}
      <div className="reading-stage-card">
        <div className="reading-header-banner">
          <div className="reading-title-area">
            <h2 className="reading-main-title">{data.title}</h2>
            <span className="reading-author">🏷️ {data.author}</span>
          </div>

          <div className="reading-actions-bar">
            <button 
              className={`read-all-btn ${isReadingAll ? 'playing' : ''}`}
              onClick={handleReadAll}
            >
              {isReadingAll ? '⏸️ 正在带读中...' : '▶️ 伴读朗读全篇'}
            </button>

            <button 
              className={`hide-char-btn ${isHideChars ? 'active' : ''}`}
              onClick={() => {
                playMagic()
                setIsHideChars(!isHideChars)
              }}
              title="隐藏汉字只留拼音，考考能不能自己背出来"
            >
              {isHideChars ? '👀 显示汉字' : '🙈 隐藏文字，看图背诵'}
            </button>
          </div>
        </div>

        {/* 绘本中心插画与指读区域 */}
        <div className="reading-main-content">
          <div className="reading-cover-wrap">
            {imgError || !data.image ? (
              <div className="reading-cover-fallback">
                <span className="cover-fallback-emoji">📖</span>
                <span className="cover-fallback-title">{data.title}</span>
              </div>
            ) : (
              <img 
                src={data.image} 
                alt={data.title} 
                className="reading-cover-img"
                loading="lazy"
                onError={() => setImgError(true)}
              />
            )}
            <div className="cover-badge">🐰 经典儿歌</div>
          </div>

          <div className="reading-text-board">
            {data.lines.map((line, lineIdx) => {
              const isCurrentLine = activeLineIdx === lineIdx
              return (
                <div 
                  key={lineIdx} 
                  className={`reading-line-row ${isCurrentLine ? 'active-line' : ''}`}
                  onClick={() => handleReadLine(lineIdx)}
                >
                  <button className="line-play-badge" title="点击朗读此行">
                    {isCurrentLine ? '🔊' : '▶'}
                  </button>

                  <div className="ruby-chars-wrap">
                    {line.map((item, charIdx) => {
                      const isPunctuation = item.char === '，' || item.char === '。' || item.char === '！'
                      return (
                        <div 
                          key={charIdx} 
                          className={`ruby-char-item ${isPunctuation ? 'punctuation' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCharClick(item.char)
                          }}
                        >
                          {/* 拼音标在上方 */}
                          <span className="pinyin-ruby">{item.pinyin}</span>
                          {/* 汉字在下方，支持遮挡挑战 */}
                          <span className={`hanzi-base ${isHideChars && !isPunctuation ? 'hidden-char' : ''}`}>
                            {isHideChars && !isPunctuation ? '⭐' : item.char}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 背诵大挑战 */}
        <div className="recite-challenge-card">
          <div className="recite-info">
            <span className="recite-badge">🏆 背诵大挑战</span>
            <p>能够不看字、流利地把这首儿歌背给爸爸妈妈听吗？</p>
          </div>
          <button 
            className={`recite-confirm-btn ${isRecited ? 'recited-done' : ''}`}
            onClick={() => {
              playCheer()
              setIsRecited(true)
            }}
          >
            {isRecited ? '🌟 我已经背熟啦！真棒！' : '🙋 我背出来了，点我挑战成功！'}
          </button>
        </div>
      </div>

      {/* 底部打卡完成区域 */}
      <div className="homework-bottom-bar">
        <button 
          className={`finish-homework-btn ${isCompleted ? 'already-done' : ''}`}
          onClick={() => {
            playCheer()
            onCompleteTask('reading')
          }}
        >
          {isCompleted ? '✅ 指读作业已完成（点击重新庆祝）' : '🎉 我学会背诵了！打卡领贴纸'}
        </button>
      </div>
    </div>
  )
}
