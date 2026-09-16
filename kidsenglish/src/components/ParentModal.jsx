import React, { useState } from 'react'
import { PRESET_WORDS_BANK, PRESET_PINYIN_BANK, PRESET_READING_BANK, DEFAULT_HOMEWORK } from '../data/defaultHomework'
import { playPop, playCorrect, playTryAgain } from '../utils/sound'

export function ParentModal({ currentHomework, onSaveHomework, onResetHomework, onClose }) {
  // 儿童防误触门禁（简单算术题）
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [mathAnswer, setMathAnswer] = useState('')
  const [gateQuestion] = useState(() => {
    const a = Math.floor(Math.random() * 5) + 3
    const b = Math.floor(Math.random() * 4) + 2
    return { a, b, answer: a + b }
  })
  const [gateError, setGateError] = useState(false)

  // 作业编辑状态
  const [childName, setChildName] = useState(currentHomework.childName || '小悦悦')
  const [englishNote, setEnglishNote] = useState(currentHomework.english.teacherNote || '')
  const [words, setWords] = useState(currentHomework.english.words || [])
  const [pinyinNote, setPinyinNote] = useState(currentHomework.pinyin.teacherNote || '')
  const [letters, setLetters] = useState(currentHomework.pinyin.letters || [])
  const [readingTitle, setReadingTitle] = useState(currentHomework.reading.title || '')
  const [readingNote, setReadingNote] = useState(currentHomework.reading.teacherNote || '')

  // 快速新增单词表单
  const [newWord, setNewWord] = useState('')
  const [newWordCn, setNewWordCn] = useState('')

  // 验证门禁
  const handleVerifyGate = (e) => {
    e.preventDefault()
    if (parseInt(mathAnswer, 10) === gateQuestion.answer) {
      playCorrect()
      setIsUnlocked(true)
      setGateError(false)
    } else {
      playTryAgain()
      setGateError(true)
    }
  }

  // 从预设词库一键追加单词
  const handleAddPresetWord = (preset) => {
    playPop()
    if (words.some(w => w.word.toLowerCase() === preset.word.toLowerCase())) return
    setWords([...words, { ...preset, id: 'w-' + Date.now() + Math.random() }])
  }

  // 删除单词
  const handleRemoveWord = (id) => {
    playPop()
    if (words.length <= 1) return alert('至少保留一个单词供小朋友练习哦！')
    setWords(words.filter(w => w.id !== id))
  }

  // 手动新增自定义单词
  const handleAddCustomWord = (e) => {
    e.preventDefault()
    if (!newWord.trim()) return
    playPop()
    const wordObj = {
      id: 'w-custom-' + Date.now(),
      word: newWord.trim().toLowerCase(),
      phonetic: `/${newWord.trim()}/`,
      translation: newWordCn.trim() || newWord.trim(),
      emoji: '✨',
      image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&auto=format&fit=crop',
      sentence: `I like this ${newWord.trim()}.`,
      sentenceCn: `我喜欢这个${newWordCn.trim() || newWord.trim()}。`
    }
    setWords([...words, wordObj])
    setNewWord('')
    setNewWordCn('')
  }

  // 从预设拼音一键追加
  const handleAddPresetPinyin = (preset) => {
    playPop()
    if (letters.some(p => p.char === preset.char)) return
    setLetters([...letters, { ...preset, id: 'p-' + Date.now(), soundTip: '仔细体会嘴型并读准' }])
  }

  // 删除拼音
  const handleRemovePinyin = (id) => {
    playPop()
    if (letters.length <= 1) return alert('至少保留一个拼音字母练习哦！')
    setLetters(letters.filter(p => p.id !== id))
  }

  // 一键切换经典课文阅读
  const handleSwitchReading = (presetReading) => {
    playPop()
    setReadingTitle(presetReading.title)
    currentHomework.reading = {
      ...currentHomework.reading,
      ...presetReading
    }
  }

  // 保存并更新作业
  const handleSave = () => {
    playCorrect()
    const updated = {
      ...currentHomework,
      childName,
      english: {
        ...currentHomework.english,
        teacherNote: englishNote,
        words
      },
      pinyin: {
        ...currentHomework.pinyin,
        teacherNote: pinyinNote,
        letters
      },
      reading: {
        ...currentHomework.reading,
        title: readingTitle,
        teacherNote: readingNote
      }
    }
    onSaveHomework(updated)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="parent-modal-card animate-pop" onClick={(e) => e.stopPropagation()}>
        <div className="parent-modal-header">
          <div className="title-box">
            <span className="modal-icon">👩‍🏫</span>
            <div>
              <h2 className="modal-title">家长 / 老师作业布置中心</h2>
              <p className="modal-subtitle">便捷录入今日学校布置的作业，自动转成趣味闯关题</p>
            </div>
          </div>
          <button className="close-modal-btn" onClick={() => { playPop(); onClose(); }}>✕</button>
        </div>

        {/* 1. 儿童锁验证 */}
        {!isUnlocked ? (
          <div className="parent-gate-card">
            <div className="gate-icon">🔒</div>
            <h3>家长身份验证（防止小朋友误改）</h3>
            <p>请计算：<strong>{gateQuestion.a} + {gateQuestion.b} = ?</strong></p>
            <form onSubmit={handleVerifyGate} className="gate-form">
              <input 
                type="number" 
                className="gate-input" 
                placeholder="请输入答案"
                value={mathAnswer}
                onChange={(e) => setMathAnswer(e.target.value)}
                autoFocus
              />
              <button type="submit" className="gate-submit-btn">进入布置</button>
            </form>
            {gateError && <p className="gate-error-txt">❌ 计算错误，请重新输入哦！</p>}
          </div>
        ) : (
          /* 2. 正式作业配置界面 */
          <div className="parent-config-body">
            {/* 基础设置 */}
            <div className="config-section">
              <label className="section-label">👧 小朋友名字 / 昵称：</label>
              <input 
                type="text" 
                className="config-text-input" 
                value={childName} 
                onChange={(e) => setChildName(e.target.value)} 
              />
            </div>

            {/* 英语板块配置 */}
            <div className="config-section">
              <h4 className="section-title">🔤 1. 英语课作业（今日要复习的单词）</h4>
              <label className="field-label">老师微信通知要求：</label>
              <textarea 
                className="config-textarea" 
                rows="2"
                value={englishNote}
                onChange={(e) => setEnglishNote(e.target.value)}
              />

              <label className="field-label">当前待复习单词列表：</label>
              <div className="current-chips-list">
                {words.map((w) => (
                  <span key={w.id} className="chip-pill">
                    {w.emoji} <strong>{w.word}</strong> ({w.translation})
                    <button className="chip-del-btn" onClick={() => handleRemoveWord(w.id)}>✕</button>
                  </span>
                ))}
              </div>

              {/* 预设单词快捷添加 */}
              <div className="preset-quick-add">
                <span className="quick-label">⚡ 快捷点击添加高频词：</span>
                <div className="preset-buttons-row">
                  {PRESET_WORDS_BANK.map((p, idx) => (
                    <button 
                      key={idx} 
                      className="preset-add-btn"
                      onClick={() => handleAddPresetWord(p)}
                    >
                      + {p.emoji} {p.word}
                    </button>
                  ))}
                </div>
              </div>

              {/* 自定义输入新增 */}
              <form onSubmit={handleAddCustomWord} className="custom-add-form">
                <input 
                  type="text" 
                  className="small-input" 
                  placeholder="新单词(如: milk)"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                />
                <input 
                  type="text" 
                  className="small-input" 
                  placeholder="中文意思(如: 牛奶)"
                  value={newWordCn}
                  onChange={(e) => setNewWordCn(e.target.value)}
                />
                <button type="submit" className="custom-add-btn">+ 添加这个单词</button>
              </form>
            </div>

            {/* 语文拼音板块配置 */}
            <div className="config-section">
              <h4 className="section-title">🀄 2. 语文拼音作业</h4>
              <label className="field-label">老师通知要求：</label>
              <textarea 
                className="config-textarea" 
                rows="2"
                value={pinyinNote}
                onChange={(e) => setPinyinNote(e.target.value)}
              />

              <label className="field-label">当前待练拼音：</label>
              <div className="current-chips-list">
                {letters.map((p) => (
                  <span key={p.id} className="chip-pill pinyin-chip">
                    <strong>{p.char}</strong> ({p.type})
                    <button className="chip-del-btn" onClick={() => handleRemovePinyin(p.id)}>✕</button>
                  </span>
                ))}
              </div>

              {/* 预设拼音快捷添加 */}
              <div className="preset-quick-add">
                <span className="quick-label">⚡ 快捷添加声母/韵母：</span>
                <div className="preset-buttons-row">
                  {PRESET_PINYIN_BANK.map((p, idx) => (
                    <button 
                      key={idx} 
                      className="preset-add-btn"
                      onClick={() => handleAddPresetPinyin(p)}
                    >
                      + {p.char} ({p.type})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 语文指读课文配置 */}
            <div className="config-section">
              <h4 className="section-title">📖 3. 绘本 / 儿歌指读篇目</h4>
              <label className="field-label">当前篇目：</label>
              <input 
                type="text" 
                className="config-text-input" 
                value={readingTitle} 
                onChange={(e) => setReadingTitle(e.target.value)} 
              />

              <label className="field-label">老师朗读要求：</label>
              <input 
                type="text" 
                className="config-text-input" 
                value={readingNote} 
                onChange={(e) => setReadingNote(e.target.value)} 
              />

              <div className="preset-quick-add">
                <span className="quick-label">⚡ 一键替换经典阅读篇目：</span>
                <div className="preset-buttons-row">
                  {PRESET_READING_BANK.map((r, idx) => (
                    <button 
                      key={idx} 
                      className="preset-add-btn"
                      onClick={() => handleSwitchReading(r)}
                    >
                      📖 换成《{r.title}》
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 保存与重置操作栏 */}
            <div className="parent-footer-actions">
              <button 
                className="reset-default-btn"
                onClick={() => {
                  if (window.confirm('确定要恢复为今日默认预设作业吗？')) {
                    onResetHomework()
                    onClose()
                  }
                }}
              >
                🔄 恢复默认预设作业
              </button>

              <div className="main-save-group">
                <button className="cancel-btn" onClick={() => { playPop(); onClose(); }}>取消</button>
                <button className="save-btn" onClick={handleSave}>💾 保存并应用到作业乐园</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
