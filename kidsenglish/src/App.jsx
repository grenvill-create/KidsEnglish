import React, { useState, useEffect } from 'react'
import { DEFAULT_HOMEWORK, STICKERS } from './data/defaultHomework'
import { Header } from './components/Header'
import { TodayOverview } from './components/TodayOverview'
import { EnglishHomework } from './components/EnglishHomework'
import { PinyinHomework } from './components/PinyinHomework'
import { ReadingHomework } from './components/ReadingHomework'
import { StickerBook } from './components/StickerBook'
import { ParentModal } from './components/ParentModal'
import { RewardModal } from './components/RewardModal'
import './App.css'

function App() {
  // 1. 本地存储持久化读取
  const [homework, setHomework] = useState(() => {
    try {
      const saved = localStorage.getItem('kids_daily_homework_v4')
      return saved ? JSON.parse(saved) : DEFAULT_HOMEWORK
    } catch {
      return DEFAULT_HOMEWORK
    }
  })

  const [completedTasks, setCompletedTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('kids_completed_tasks_v2')
      return saved ? JSON.parse(saved) : { english: false, pinyin: false, reading: false }
    } catch {
      return { english: false, pinyin: false, reading: false }
    }
  })

  const [unlockedStickers, setUnlockedStickers] = useState(() => {
    try {
      const saved = localStorage.getItem('kids_unlocked_stickers_v2')
      return saved ? JSON.parse(saved) : ['s1', 's4'] // 默认赠送两张可爱新手贴纸
    } catch {
      return ['s1', 's4']
    }
  })

  // 当前导航 Tab: 'overview' | 'english' | 'pinyin' | 'reading'
  const [activeTab, setActiveTab] = useState('overview')

  // 弹窗状态
  const [rewardSticker, setRewardSticker] = useState(null)
  const [showStickerBook, setShowStickerBook] = useState(false)
  const [showParentModal, setShowParentModal] = useState(false)

  // 自动同步到 localStorage
  useEffect(() => {
    localStorage.setItem('kids_daily_homework_v4', JSON.stringify(homework))
  }, [homework])

  useEffect(() => {
    localStorage.setItem('kids_completed_tasks_v2', JSON.stringify(completedTasks))
  }, [completedTasks])

  useEffect(() => {
    localStorage.setItem('kids_unlocked_stickers_v2', JSON.stringify(unlockedStickers))
  }, [unlockedStickers])

  // 完成一个作业任务打卡
  const handleCompleteTask = (taskKey) => {
    setCompletedTasks(prev => ({
      ...prev,
      [taskKey]: true
    }))

    // 随机掉落一张未解锁贴纸
    const lockedStickers = STICKERS.filter(s => !unlockedStickers.includes(s.id))
    let newSticker = null
    if (lockedStickers.length > 0) {
      newSticker = lockedStickers[Math.floor(Math.random() * lockedStickers.length)]
      setUnlockedStickers(prev => [...prev, newSticker.id])
    } else {
      // 全解锁了，奖励大金星
      newSticker = STICKERS[STICKERS.length - 1]
    }

    setRewardSticker(newSticker)
  }

  // 重置今日作业
  const handleResetHomework = () => {
    setHomework(DEFAULT_HOMEWORK)
    setCompletedTasks({ english: false, pinyin: false, reading: false })
    localStorage.removeItem('kids_daily_homework_v2')
    localStorage.removeItem('kids_completed_tasks_v2')
  }

  // 计算进度
  const totalTasks = 3
  const completedCount = Object.values(completedTasks).filter(Boolean).length

  return (
    <div className="kids-app-container">
      {/* 顶部主视觉栏 */}
      <Header 
        currentDate={homework.date}
        childName={homework.childName || '小悦悦'}
        completedCount={completedCount}
        totalCount={totalTasks}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenParentModal={() => setShowParentModal(true)}
        onOpenStickerBook={() => setShowStickerBook(true)}
        unlockedStickersCount={unlockedStickers.length}
      />

      {/* 主视图展示区域 */}
      <main className="main-content-wrap">
        {activeTab === 'overview' && (
          <TodayOverview 
            homework={homework}
            completedTasks={completedTasks}
            onNavigateTab={setActiveTab}
            onClaimAllRewards={() => setShowStickerBook(true)}
          />
        )}

        {activeTab === 'english' && (
          <EnglishHomework 
            data={homework.english}
            isCompleted={!!completedTasks.english}
            onCompleteTask={handleCompleteTask}
          />
        )}

        {activeTab === 'pinyin' && (
          <PinyinHomework 
            data={homework.pinyin}
            isCompleted={!!completedTasks.pinyin}
            onCompleteTask={handleCompleteTask}
          />
        )}

        {activeTab === 'reading' && (
          <ReadingHomework 
            data={homework.reading}
            isCompleted={!!completedTasks.reading}
            onCompleteTask={handleCompleteTask}
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
          currentHomework={homework}
          onSaveHomework={setHomework}
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
    </div>
  )
}

export default App
