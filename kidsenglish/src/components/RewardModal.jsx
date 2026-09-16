import React, { useEffect } from 'react'
import { playCheer, playMagic, playPop } from '../utils/sound'

export function RewardModal({ sticker, onClose, onGoToStickers }) {
  useEffect(() => {
    playCheer()
  }, [])

  if (!sticker) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="reward-modal-card animate-pop" onClick={(e) => e.stopPropagation()}>
        {/* 彩带背景装饰 */}
        <div className="confetti-effect">
          <span className="confetti c1">🎊</span>
          <span className="confetti c2">✨</span>
          <span className="confetti c3">🌟</span>
          <span className="confetti c4">🎉</span>
          <span className="confetti c5">💖</span>
        </div>

        <div className="reward-badge-header">
          <span className="crown-float">👑</span>
          <h2 className="reward-title">太棒了！闯关成功！</h2>
          <p className="reward-sub">你认真做作业的样子真耀眼，送你一个专属小贴纸：</p>
        </div>

        <div className="sticker-reward-box animate-bounce" onClick={playMagic}>
          <div className="reward-sticker-icon">{sticker.icon}</div>
          <h3 className="reward-sticker-name">{sticker.name}</h3>
          <p className="reward-sticker-desc">{sticker.desc}</p>
        </div>

        <div className="reward-action-row">
          <button 
            className="reward-btn keep-btn" 
            onClick={() => { playPop(); onClose(); }}
          >
            🌟 继续做其他作业
          </button>
          
          <button 
            className="reward-btn book-btn" 
            onClick={() => { playPop(); onGoToStickers(); }}
          >
            🎁 放入贴纸本查看
          </button>
        </div>
      </div>
    </div>
  )
}
