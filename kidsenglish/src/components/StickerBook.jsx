import React from 'react'
import { STICKERS } from '../data/defaultHomework'
import { playPop, playMagic } from '../utils/sound'

export function StickerBook({ unlockedStickers = [], onClose }) {
  const unlockedSet = new Set(unlockedStickers)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="sticker-book-modal animate-pop" onClick={(e) => e.stopPropagation()}>
        <div className="sticker-book-header">
          <div className="book-title-wrap">
            <span className="book-icon">🎁</span>
            <div>
              <h2 className="book-title">我的萌趣贴纸相册</h2>
              <p className="book-subtitle">
                已收集 <strong>{unlockedStickers.length}</strong> / {STICKERS.length} 张贴纸
                {unlockedStickers.length === STICKERS.length && ' 🏆 全套大满贯！太厉害啦！'}
              </p>
            </div>
          </div>

          <button className="close-modal-btn" onClick={() => { playPop(); onClose(); }}>
            ✕
          </button>
        </div>

        {/* 贴纸展示网格 */}
        <div className="stickers-grid">
          {STICKERS.map((stk) => {
            const isUnlocked = unlockedSet.has(stk.id)
            return (
              <div 
                key={stk.id} 
                className={`sticker-slot ${isUnlocked ? 'unlocked' : 'locked'}`}
                onClick={() => {
                  if (isUnlocked) {
                    playMagic()
                  } else {
                    playPop()
                  }
                }}
              >
                <div className="sticker-icon-display">
                  {isUnlocked ? stk.icon : '❓'}
                </div>
                <div className="sticker-label">
                  {isUnlocked ? stk.name : '神秘贴纸'}
                </div>
                <div className="sticker-desc-small">
                  {isUnlocked ? stk.desc : '完成每日作业解锁'}
                </div>
              </div>
            )
          })}
        </div>

        <div className="sticker-book-footer">
          <p className="sticker-encouragement">
            💡 小贴士：每天认真完成英语、拼音和指读作业，就能解锁新贴纸哦！
          </p>
          <button className="done-view-btn" onClick={() => { playPop(); onClose(); }}>
            返回做作业
          </button>
        </div>
      </div>
    </div>
  )
}
