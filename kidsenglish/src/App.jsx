import React, { useState, useEffect } from 'react'
import { DEFAULT_HOMEWORK, DEFAULT_HOMEWORK_LIST, STICKERS } from './data/defaultHomework'
import { Header } from './components/Header'
import { TodayOverview } from './components/TodayOverview'
import { EnglishHomework } from './components/EnglishHomework'
import { PinyinHomework } from './components/PinyinHomework'
import { ReadingHomework } from './components/ReadingHomework'
import { HomeworkHistory } from './components/HomeworkHistory'
import { StickerBook } from './components/StickerBook'
import { ParentModal } from './components/ParentModal'
import { RewardModal } from './components/RewardModal'
import { SettingsModal } from './components/SettingsModal'
import { getSoundEnabled, setSoundEnabled } from './utils/sound'
import './App.css'

function sanitizeHomeworkList(list) {
  if (!Array.isArray(list) || list.length === 0) return DEFAULT_HOMEWORK_LIST
  const FIXED_IMAGES = {
    'drinking': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop',
    'apple': 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=600&auto=format&fit=crop',
    'banana': 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=600&auto=format&fit=crop'
  }

  let hasChanges = false
  const updatedList = list.map(hw => {
    if (!hw || !hw.english || !Array.isArray(hw.english.words)) return hw
    const newWords = hw.english.words.map(w => {
      if (w && FIXED_IMAGES[w.word]) {
        if (!w.image || w.image.includes('1548839140') || w.image.includes('1560806887') || w.image.includes('1571771894')) {
          hasChanges = true
          return { ...w, image: FIXED_IMAGES[w.word] }
        }
      }
      return w
    })
    return { ...hw, english: { ...hw.english, words: newWords } }
  })

  if (hasChanges) {
    try {
      localStorage.setItem('kids_homework_list_v2', JSON.stringify(updatedList))
    } catch {}
  }
  return updatedList
}

function App() {
  // 1. 作业列表持久化读取（包含今日与往期历史）
  const [homeworkList, setHomeworkList] = useState(() => {
    try {
      const saved = localStorage.getItem('kids_homework_list_v2')
      return saved ? sanitizeHomeworkList(JSON.parse(saved)) : DEFAULT_HOMEWORK_LIST
    } catch {
      return DEFAULT_HOMEWORK_LIST
    }
  })

  // 当前正在浏览或练习的某一天作业 ID（默认今天）
  const [activeHomeworkId, setActiveHomeworkId] = useState(() => {
    return (homeworkList[0] && homeworkList[0].id) || DEFAULT_HOMEWORK.id
  })

  // 每一天的打卡记录 Map: { [homeworkId]: { english: boolean, pinyin: boolean, reading: boolean } }
  const [completedMap, setCompletedMap] = useState(() => {
    try {
      const saved = localStorage.getItem('kids_completed_map_v2')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  // 贴纸本
  const [unlockedStickers, setUnlockedStickers] = useState(() => {
    try {
      const saved = localStorage.getItem('kids_unlocked_stickers_v2')
      return saved ? JSON.parse(saved) : ['s1', 's4']
    } catch {
      return ['s1', 's4']
    }
  })

  // 当前激活的视图: 'overview' | 'english' | 'pinyin' | 'reading' | 'history'
  const [activeTab, setActiveTab] = useState('overview')

  // 弹窗状态
  const [rewardSticker, setRewardSticker] = useState(null)
  const [showStickerBook, setShowStickerBook] = useState(false)
  const [showParentModal, setShowParentModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [soundEnabled, setSoundEnabledState] = useState(getSoundEnabled)

  const handleToggleSound = (val) => {
    setSoundEnabled(val)
    setSoundEnabledState(val)
  }

  // 获取当前正在查看的那一天作业
  const currentHomework = homeworkList.find(h => h.id === activeHomeworkId) || homeworkList[0] || DEFAULT_HOMEWORK
  const currentCompletedTasks = completedMap[currentHomework.id] || { english: false, pinyin: false, reading: false }

  // 是否正在复习往期（不是最新今天）
  const isReviewingPast = activeHomeworkId !== (homeworkList[0] && homeworkList[0].id)

  // 自动持久化
  useEffect(() => {
    localStorage.setItem('kids_homework_list_v2', JSON.stringify(homeworkList))
  }, [homeworkList])

  useEffect(() => {
    localStorage.setItem('kids_completed_map_v2', JSON.stringify(completedMap))
  }, [completedMap])

  useEffect(() => {
    localStorage.setItem('kids_unlocked_stickers_v2', JSON.stringify(unlockedStickers))
  }, [unlockedStickers])

  // 完成一个作业打卡
  const handleCompleteTask = (taskKey) => {
    setCompletedMap(prev => ({
      ...prev,
      [currentHomework.id]: {
        ...(prev[currentHomework.id] || {}),
        [taskKey]: true
      }
    }))

    // 随机解锁一张未获得贴纸
    const lockedStickers = STICKERS.filter(s => !unlockedStickers.includes(s.id))
    let newSticker = null
    if (lockedStickers.length > 0) {
      newSticker = lockedStickers[Math.floor(Math.random() * lockedStickers.length)]
      setUnlockedStickers(prev => [...prev, newSticker.id])
    } else {
      newSticker = STICKERS[STICKERS.length - 1]
    }

    setRewardSticker(newSticker)
  }

  // 切换查看特定一天的作业
  const handleSelectHomework = (item, targetTab = 'overview') => {
    setActiveHomeworkId(item.id)
    setActiveTab(targetTab)
  }

  // 一键返回今日最新作业
  const handleBackToToday = () => {
    if (homeworkList.length > 0) {
      setActiveHomeworkId(homeworkList[0].id)
    }
    setActiveTab('overview')
  }

  // 家长保存作业
  const handleSaveHomework = (updatedHomework) => {
    setHomeworkList(prev => {
      const idx = prev.findIndex(h => h.id === updatedHomework.id)
      if (idx !== -1) {
        const next = [...prev]
        next[idx] = updatedHomework
        return next
      } else {
        // 如果是全新的一天，添加到最前面
        return [updatedHomework, ...prev]
      }
    })
  }

  // 重置回预设列表
  const handleResetHomework = () => {
    setHomeworkList(DEFAULT_HOMEWORK_LIST)
    setActiveHomeworkId(DEFAULT_HOMEWORK_LIST[0].id)
    setCompletedMap({})
    localStorage.removeItem('kids_homework_list_v2')
    localStorage.removeItem('kids_completed_map_v2')
  }

  // 当前作业通关进度
  const totalTasks = 3
  const completedCount = Object.values(currentCompletedTasks).filter(Boolean).length

  return (
    <div className="kids-app-container">
      {/* 顶部主视觉栏 */}
      <Header 
        currentDate={currentHomework.date}
        childName={currentHomework.childName || ''}
        completedCount={completedCount}
        totalCount={totalTasks}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenParentModal={() => setShowParentModal(true)}
        onOpenStickerBook={() => setShowStickerBook(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
        soundEnabled={soundEnabled}
        unlockedStickersCount={unlockedStickers.length}
        isReviewingPast={isReviewingPast}
        onBackToToday={handleBackToToday}
      />

      {/* 主视图区域 */}
      <main className="main-content-wrap">
        {/* 1. 当前作业大厅 */}
        {activeTab === 'overview' && (
          <TodayOverview 
            homework={currentHomework}
            completedTasks={currentCompletedTasks}
            onNavigateTab={setActiveTab}
            onClaimAllRewards={() => setShowStickerBook(true)}
          />
        )}

        {/* 2. 英语魔法屋 */}
        {activeTab === 'english' && (
          <EnglishHomework 
            data={currentHomework.english}
            isCompleted={!!currentCompletedTasks.english}
            onCompleteTask={handleCompleteTask}
          />
        )}

        {/* 3. 语文拼音 */}
        {activeTab === 'pinyin' && (
          <PinyinHomework 
            data={currentHomework.pinyin}
            isCompleted={!!currentCompletedTasks.pinyin}
            onCompleteTask={handleCompleteTask}
          />
        )}

        {/* 4. 绘本指读 */}
        {activeTab === 'reading' && (
          <ReadingHomework 
            data={currentHomework.reading}
            isCompleted={!!currentCompletedTasks.reading}
            onCompleteTask={handleCompleteTask}
          />
        )}

        {/* 5. 往期作业清单与归档 */}
        {activeTab === 'history' && (
          <HomeworkHistory 
            homeworkList={homeworkList}
            activeHomeworkId={activeHomeworkId}
            completedMap={completedMap}
            onSelectHomework={handleSelectHomework}
            onOpenParentModal={() => setShowParentModal(true)}
          />
        )}
      </main>

      {/* 贴纸相册弹窗 */}
      {showStickerBook && (
        <StickerBook 
          unlockedStickers={unlockedStickers}
          onClose={() => setShowStickerBook(false)}
        />
      )}

      {/* 家长布置弹窗 */}
      {showParentModal && (
        <ParentModal 
          currentHomework={currentHomework}
          onSaveHomework={handleSaveHomework}
          onResetHomework={handleResetHomework}
          onClose={() => setShowParentModal(false)}
        />
      )}

      {/* 通关庆祝奖励弹窗 */}
      {rewardSticker && (
        <RewardModal 
          sticker={rewardSticker}
          onClose={() => setRewardSticker(null)}
          onGoToStickers={() => {
            setRewardSticker(null)
            setShowStickerBook(true)
          }}
        />
      )}

      {/* 系统设置与音效开关弹窗 */}
      {showSettingsModal && (
        <SettingsModal 
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          unlockedStickersCount={unlockedStickers.length}
          onResetStickers={() => setUnlockedStickers(['s1', 's4'])}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </div>
  )
}

export default App
