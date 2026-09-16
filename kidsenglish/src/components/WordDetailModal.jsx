import React, { useEffect } from 'react'
import { speakEnglish, stopSpeech } from '../utils/speech'
import { playPop } from '../utils/sound'

export function WordDetailModal({ wordData, onClose }) {
  if (!wordData) return null

  // 弹窗出现时自动朗读单词
  useEffect(() => {
    if (wordData && wordData.word) {
      speakEnglish(wordData.word, false)
    }
    return () => {
      stopSpeech()
    }
  }, [wordData])

  const handlePlayWord = (isSlow = false) => {
    playPop()
    speakEnglish(wordData.word, isSlow)
  }

  const handlePlayExample = () => {
    playPop()
    if (wordData.exampleEn) {
      speakEnglish(wordData.exampleEn, false)
    }
  }

  const handlePlayEnDesc = () => {
    playPop()
    if (wordData.en) {
      speakEnglish(wordData.en, false)
    }
  }

  return (
    <div className="modal-overlay word-modal-overlay" onClick={onClose}>
      <div 
        className="word-detail-modal animate-pop" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* 顶部标题与关闭 */}
        <div className="word-modal-header">
          <div className="word-title-wrap">
            <span className="word-emoji-badge">{wordData.emoji || '✨'}</span>
            <div className="word-title-col">
              <h2 className="word-main-title">{wordData.displayWord || wordData.word}</h2>
              {wordData.phonetic && (
                <span className="word-phonetic-pill">
                  {wordData.phonetic}
                </span>
              )}
            </div>
          </div>

          <button 
            className="modal-close-btn" 
            onClick={() => { playPop(); onClose(); }}
            title="关闭"
          >
            ✕
          </button>
        </div>

        {/* 语音发音快捷操作栏 */}
        <div className="word-audio-action-row">
          <button 
            className="word-speech-btn normal-btn"
            onClick={() => handlePlayWord(false)}
          >
            🔊 听标准发音
          </button>
          <button 
            className="word-speech-btn slow-btn"
            onClick={() => handlePlayWord(true)}
          >
            🐢 慢速跟着读
          </button>
        </div>

        {/* 释义核心内容 */}
        <div className="word-modal-body">
          {/* 中文释义 */}
          <div className="def-card cn-def-card">
            <div className="def-tag-row">
              <span className="def-badge cn-badge">🇨🇳 中文释义</span>
              {wordData.pos && <span className="pos-badge">{wordData.pos}</span>}
            </div>
            <div className="cn-def-text">{wordData.cn}</div>
          </div>

          {/* 英文儿童简明释义 */}
          {wordData.en && (
            <div className="def-card en-def-card">
              <div className="def-tag-row">
                <span className="def-badge en-badge">🇬🇧 英文释义</span>
                <button 
                  className="mini-read-btn" 
                  onClick={handlePlayEnDesc}
                  title="朗读英文释义"
                >
                  🔊 听英文解释
                </button>
              </div>
              <div className="en-def-text">"{wordData.en}"</div>
            </div>
          )}

          {/* 词汇小秘密 / 语法提示 */}
          {wordData.tip && (
            <div className="word-tip-box">
              <div className="tip-content">{wordData.tip}</div>
            </div>
          )}

          {/* 生动例句 */}
          {wordData.exampleEn && (
            <div className="example-card">
              <div className="example-header">
                <span className="example-badge">🌟 生活例句</span>
                <button 
                  className="mini-read-btn"
                  onClick={handlePlayExample}
                  title="听例句朗读"
                >
                  🔊 朗读例句
                </button>
              </div>
              <div className="example-en">{wordData.exampleEn}</div>
              {wordData.exampleCn && <div className="example-cn">{wordData.exampleCn}</div>}
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        <div className="word-modal-footer">
          <button 
            className="word-confirm-btn"
            onClick={() => { playPop(); onClose(); }}
          >
            💡 我学会这个词啦！
          </button>
        </div>
      </div>
    </div>
  )
}
