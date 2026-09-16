import React from 'react'
import { playPop } from '../utils/sound'

export function Header({ 
  currentDate, 
  childName, 
  completedCount, 
  totalCount, 
  activeTab, 
  setActiveTab, 
  onOpenParentModal,
  onOpenStickerBook,
  unlockedStickersCount,
  isReviewingPast = false,
  onBackToToday = null
}) {
  return (
    <header className="app-header">
      {isReviewingPast && (
        <div className="reviewing-past-banner animate-pop">
          <span>💡 当前正在复习：<strong>{currentDate}</strong> 的作业</span>
          <button className="back-today-pill" onClick={onBackToToday}>
            🚀 点击回到今日最新作业
          </button>
        </div>
      )}

      <div className="header-top">
        <div className="child-badge" onClick={playPop}>
          <div className="avatar-bubble">👧</div>
          <div className="child-info">
            <div className="date-tag">
              <span>📅 {currentDate}</span>
              <span className="weather-tag">🌸 元气满满的一天</span>
            </div>
          </div>
        </div>

        <div className="header-actions">
          <button 
            className="action-btn sticker-btn" 
            onClick={() => { playPop(); onOpenStickerBook(); }}
            title="查看我的贴纸本"
          >
            <span className="btn-icon">🎁</span>
            <span className="btn-text">贴纸本</span>
            {unlockedStickersCount > 0 && (
              <span className="badge-count">{unlockedStickersCount}</span>
            )}
          </button>

          <button 
            className="action-btn parent-btn" 
            onClick={() => { playPop(); onOpenParentModal(); }}
            title="家长布置作业"
          >
            <span className="btn-icon">👩‍🏫</span>
            <span className="btn-text">布置作业</span>
          </button>
        </div>
      </div>

      {/* 关卡进度条 */}
      <div className="progress-banner">
        <div className="progress-label">
          <span>🌟 今日闯关进度</span>
          <span className="progress-num">{completedCount} / {totalCount} 关完成</span>
        </div>
        <div className="progress-track">
          <div 
            className="progress-fill" 
            style={{ width: `${(completedCount / Math.max(totalCount, 1)) * 100}%` }}
          >
            <div className="progress-glow"></div>
          </div>
        </div>
      </div>

      {/* 主导航栏 */}
      <nav className="main-nav five-tabs">
        <button 
          className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => { playPop(); setActiveTab('overview'); }}
        >
          <span className="nav-icon">🎒</span>
          <span className="nav-label">今日作业大厅</span>
        </button>

        <button 
          className={`nav-tab ${activeTab === 'english' ? 'active' : ''}`}
          onClick={() => { playPop(); setActiveTab('english'); }}
        >
          <span className="nav-icon">🔤</span>
          <span className="nav-label">英语魔法屋</span>
        </button>

        <button 
          className={`nav-tab ${activeTab === 'pinyin' ? 'active' : ''}`}
          onClick={() => { playPop(); setActiveTab('pinyin'); }}
        >
          <span className="nav-icon">🀄</span>
          <span className="nav-label">拼音大冒险</span>
        </button>

        <button 
          className={`nav-tab ${activeTab === 'reading' ? 'active' : ''}`}
          onClick={() => { playPop(); setActiveTab('reading'); }}
        >
          <span className="nav-icon">📖</span>
          <span className="nav-label">儿歌绘本指读</span>
        </button>

        <button 
          className={`nav-tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => { playPop(); setActiveTab('history'); }}
        >
          <span className="nav-icon">📅</span>
          <span className="nav-label">往期作业清单</span>
        </button>
      </nav>
    </header>
  )
}
