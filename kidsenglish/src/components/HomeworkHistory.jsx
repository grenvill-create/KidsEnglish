import React from 'react'
import { playPop, playMagic, playCheer } from '../utils/sound'

export function HomeworkHistory({ 
  homeworkList = [], 
  activeHomeworkId, 
  completedMap = {}, 
  onSelectHomework,
  onOpenParentModal
}) {
  return (
    <div className="history-container">
      {/* 历史顶部横幅 */}
      <div className="history-header-banner">
        <div className="banner-left">
          <span className="banner-icon">📅</span>
          <div>
            <h2 className="banner-title">历史作业清单与复习归档</h2>
            <p className="banner-desc">
              系统已记录 <strong>{homeworkList.length}</strong> 天的作业。随时点击任意一天，即可重温复习当天的单词、拼音和儿歌！
            </p>
          </div>
        </div>

        <button 
          className="history-add-btn" 
          onClick={() => { playPop(); onOpenParentModal(); }}
        >
          ➕ 布置新的一天作业
        </button>
      </div>

      {/* 作业卡片列表 */}
      <div className="history-list">
        {homeworkList.map((item, index) => {
          const isCurrentActive = item.id === activeHomeworkId
          const isToday = index === 0
          const itemCompleted = completedMap[item.id] || {}
          const isAllDone = itemCompleted.english && itemCompleted.pinyin && itemCompleted.reading

          return (
            <div 
              key={item.id} 
              className={`history-card ${isCurrentActive ? 'active-card' : ''} ${isAllDone ? 'all-done' : ''}`}
            >
              <div className="history-card-top">
                <div className="date-and-badges">
                  <span className="history-date">📅 {item.date}</span>
                  {isToday && <span className="today-badge">🌟 今日最新</span>}
                  {isCurrentActive && <span className="viewing-badge">👀 当前正在练习</span>}
                </div>

                <div className="history-status-badge">
                  {isAllDone ? (
                    <span className="status-pill done">✅ 全部通关</span>
                  ) : (
                    <span className="status-pill todo">⏳ 可随时复习</span>
                  )}
                </div>
              </div>

              {/* 核心主题与老师通知 */}
              <div className="history-card-body">
                <h3 className="history-topic">
                  {item.english?.title || '今日综合课后作业'}
                </h3>
                
                {item.english?.teacherNote && (
                  <p className="history-note">
                    <strong>👩‍🏫 老师说：</strong> {item.english.teacherNote}
                  </p>
                )}

                {/* 包含的内容芯片 */}
                <div className="history-content-chips">
                  {/* 英语词汇 */}
                  <div className="chip-row">
                    <span className="chip-category">🔤 英语 ({item.english?.words?.length || 0}词):</span>
                    <div className="chip-tags-wrap">
                      {item.english?.words?.slice(0, 8).map(w => (
                        <span key={w.id} className="history-word-pill">
                          {w.emoji} {w.word}
                        </span>
                      ))}
                      {(item.english?.words?.length || 0) > 8 && (
                        <span className="history-word-pill more-pill">
                          +{item.english.words.length - 8}更多...
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 语文拼音 */}
                  {item.pinyin?.letters?.length > 0 && (
                    <div className="chip-row">
                      <span className="chip-category">🀄 拼音:</span>
                      <div className="chip-tags-wrap">
                        {item.pinyin.letters.map(p => (
                          <span key={p.id} className="history-pinyin-pill">
                            {p.char} ({p.type})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 绘本课文 */}
                  {item.reading?.title && (
                    <div className="chip-row">
                      <span className="chip-category">📖 课文:</span>
                      <span className="history-reading-pill">
                        {item.reading.title}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 操作按钮区 */}
              <div className="history-card-footer">
                {isCurrentActive ? (
                  <button 
                    className="history-switch-btn viewing-btn" 
                    onClick={() => { playPop(); onSelectHomework(item, 'overview'); }}
                  >
                    👉 正在此天中，点击进入大厅
                  </button>
                ) : (
                  <button 
                    className="history-switch-btn review-btn" 
                    onClick={() => { 
                      playMagic(); 
                      onSelectHomework(item, 'overview'); 
                    }}
                  >
                    🚀 进入这天复习做题
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
