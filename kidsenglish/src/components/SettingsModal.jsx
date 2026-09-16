import React from 'react'
import { playPop, playCorrect, playMagic, playCheer } from '../utils/sound'
import { speakEnglish, speakChinese } from '../utils/speech'

export function SettingsModal({ 
  soundEnabled, 
  onToggleSound, 
  onClose,
  unlockedStickersCount = 0,
  onResetStickers
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="settings-modal-card animate-pop" onClick={(e) => e.stopPropagation()}>
        {/* 设置弹窗头部 */}
        <div className="settings-modal-header">
          <div className="title-box">
            <span className="modal-icon">⚙️</span>
            <div>
              <h2 className="modal-title">乐园系统设置</h2>
              <p className="modal-subtitle">调节音效、试听发音与个性化设置</p>
            </div>
          </div>
          <button className="close-modal-btn" onClick={() => { playPop(); onClose(); }}>✕</button>
        </div>

        <div className="settings-body">
          {/* 1. 音效总开关 */}
          <div className="settings-section sound-toggle-section">
            <div className="section-info">
              <div className="setting-main-label">
                <span className="setting-icon">{soundEnabled ? '🔊' : '🔇'}</span>
                <strong>游戏互动音效</strong>
              </div>
              <p className="setting-desc">
                {soundEnabled 
                  ? '已开启：按键泡泡声、答对提示音与通关礼花音效' 
                  : '已静音：安静做题，不播放任何按键和通关音效'}
              </p>
            </div>

            <div className="toggle-switch-wrap">
              <label className="switch-slider">
                <input 
                  type="checkbox" 
                  checked={soundEnabled} 
                  onChange={(e) => onToggleSound(e.target.checked)} 
                />
                <span className="slider-round"></span>
              </label>
              <span className={`switch-status-text ${soundEnabled ? 'on' : 'off'}`}>
                {soundEnabled ? '开' : '关'}
              </span>
            </div>
          </div>

          {/* 音效试听区 */}
          {soundEnabled && (
            <div className="sound-preview-row">
              <span className="preview-label">🎵 音效试听：</span>
              <div className="preview-btn-group">
                <button 
                  className="sound-test-btn" 
                  onClick={() => playPop()}
                >
                  🫧 泡泡音
                </button>
                <button 
                  className="sound-test-btn" 
                  onClick={() => playCorrect()}
                >
                  🔔 答对音
                </button>
                <button 
                  className="sound-test-btn" 
                  onClick={() => playMagic()}
                >
                  ✨ 魔法星星
                </button>
                <button 
                  className="sound-test-btn" 
                  onClick={() => playCheer()}
                >
                  🎉 欢呼音
                </button>
              </div>
            </div>
          )}

          {/* 2. 语音朗读测试 */}
          <div className="settings-section">
            <div className="setting-main-label">
              <span className="setting-icon">🗣️</span>
              <strong>标准语音朗读测试</strong>
            </div>
            <p className="setting-desc">
              采用浏览器高清真人语音引擎，用于单词、课文和提问发音（不受音效静音影响）。
            </p>

            <div className="speech-test-group">
              <button 
                className="speech-test-btn en-btn"
                onClick={() => speakEnglish('Good job! You are doing great!')}
              >
                🔊 试听英语童音
              </button>
              <button 
                className="speech-test-btn cn-btn"
                onClick={() => speakChinese('太棒啦！今天也要做个认真的好宝贝！')}
              >
                🔊 试听中文发音
              </button>
            </div>
          </div>

          {/* 3. 学习进度与贴纸 */}
          <div className="settings-section">
            <div className="setting-main-label">
              <span className="setting-icon">🎁</span>
              <strong>贴纸与成就</strong>
            </div>
            <p className="setting-desc">
              当前已收集 <strong>{unlockedStickersCount}</strong> 张可爱贴纸勋章。
            </p>

            {onResetStickers && (
              <button 
                className="reset-stickers-btn"
                onClick={() => {
                  if (window.confirm('确定要重置贴纸相册重新收集吗？')) {
                    onResetStickers()
                    playPop()
                  }
                }}
              >
                🔄 重新开始收集贴纸
              </button>
            )}
          </div>
        </div>

        {/* 底部完成按钮 */}
        <div className="settings-modal-footer">
          <button 
            className="settings-save-btn" 
            onClick={() => { playPop(); onClose(); }}
          >
            完成并返回乐园
          </button>
        </div>
      </div>
    </div>
  )
}
