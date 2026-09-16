import React from 'react'
import { playPop, playCheer } from '../utils/sound'

export function TodayOverview({ homework, completedTasks, onNavigateTab, onClaimAllRewards }) {
  const isEnglishDone = !!completedTasks.english
  const isPinyinDone = !!completedTasks.pinyin
  const isReadingDone = !!completedTasks.reading
  const allDone = isEnglishDone && isPinyinDone && isReadingDone

  return (
    <div className="overview-container">
      {/* 鼓励小横幅 */}
      <div className="cheer-banner">
        <div className="cheer-avatar">🦄</div>
        <div className="cheer-content">
          <h3>加油呀，今天也要大显身手！</h3>
          <p>
            老师布置了 3 个有趣的课后作业。每闯过一关，就能点亮小星星、解锁一个可爱贴纸哦！
          </p>
        </div>
        {allDone && (
          <button className="celebrate-btn" onClick={() => { playCheer(); onClaimAllRewards(); }}>
            🎉 全部通关，领大奖章！
          </button>
        )}
      </div>

      {/* 任务卡片三列 */}
      <div className="task-grid">
        {/* 1. 英语作业卡片 */}
        <div className={`task-card english-card ${isEnglishDone ? 'done' : ''}`}>
          <div className="card-badge">
            <span className="badge-icon">🔤</span>
            <span className="badge-subject">英语作业</span>
            {isEnglishDone ? (
              <span className="status-tag done-tag">✅ 已通关</span>
            ) : (
              <span className="status-tag todo-tag">⏳ 待闯关</span>
            )}
          </div>

          <div className="card-body">
            <h4 className="card-task-title">重点单词复习与趣味拓展</h4>
            <p className="card-teacher-note">
              <strong>👩‍🏫 老师说：</strong> {homework.english.teacherNote}
            </p>

            <div className="preview-pills">
              {homework.english.words.map((w) => (
                <span key={w.id} className="preview-pill">
                  {w.emoji} {w.word}
                </span>
              ))}
            </div>
          </div>

          <div className="card-footer">
            <button 
              className="start-task-btn"
              onClick={() => { playPop(); onNavigateTab('english'); }}
            >
              {isEnglishDone ? '🔁 再复习一次' : '🚀 开始英语闯关'}
            </button>
          </div>
        </div>

        {/* 2. 语文拼音作业卡片 */}
        <div className={`task-card pinyin-card ${isPinyinDone ? 'done' : ''}`}>
          <div className="card-badge">
            <span className="badge-icon">🀄</span>
            <span className="badge-subject">语文拼音</span>
            {isPinyinDone ? (
              <span className="status-tag done-tag">✅ 已通关</span>
            ) : (
              <span className="status-tag todo-tag">⏳ 待闯关</span>
            )}
          </div>

          <div className="card-body">
            <h4 className="card-task-title">声母韵母发音与声韵拼读</h4>
            <p className="card-teacher-note">
              <strong>👩‍🏫 老师说：</strong> {homework.pinyin.teacherNote}
            </p>

            <div className="preview-pills pinyin-pills">
              {homework.pinyin.letters.map((p) => (
                <span key={p.id} className="preview-pill pinyin-pill">
                  {p.char} ({p.type})
                </span>
              ))}
            </div>
          </div>

          <div className="card-footer">
            <button 
              className="start-task-btn"
              onClick={() => { playPop(); onNavigateTab('pinyin'); }}
            >
              {isPinyinDone ? '🔁 再玩拼读' : '🚀 开始拼音大冒险'}
            </button>
          </div>
        </div>

        {/* 3. 语文阅读指读作业卡片 */}
        <div className={`task-card reading-card ${isReadingDone ? 'done' : ''}`}>
          <div className="card-badge">
            <span className="badge-icon">📖</span>
            <span className="badge-subject">儿歌绘本指读</span>
            {isReadingDone ? (
              <span className="status-tag done-tag">✅ 已通关</span>
            ) : (
              <span className="status-tag todo-tag">⏳ 待闯关</span>
            )}
          </div>

          <div className="card-body">
            <h4 className="card-task-title">{homework.reading.title}</h4>
            <p className="card-teacher-note">
              <strong>👩‍🏫 老师说：</strong> {homework.reading.teacherNote}
            </p>

            <div className="reading-preview-box">
              <span className="reading-preview-txt">
                {homework.reading.lines[0]?.map(c => c.char).join('')}...
              </span>
            </div>
          </div>

          <div className="card-footer">
            <button 
              className="start-task-btn"
              onClick={() => { playPop(); onNavigateTab('reading'); }}
            >
              {isReadingDone ? '🔁 再读一遍' : '🚀 开始指读背诵'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
