import { useState, useEffect, useRef } from 'react'
import { supabase } from './lib/supabase'
import './App.css'

function App() {
  const [dbStatus, setDbStatus] = useState('Checking connection...')
  const [mode, setMode] = useState('study') 
  const [studySubMode, setStudySubMode] = useState('words') 
  
  const [sentences, setSentences] = useState([])
  const [progress, setProgress] = useState({})
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)

  // 词汇模式：当前索引
  const [vocabIndex, setVocabIndex] = useState(0)

  // 庆祝特效
  const [showCelebration, setShowCelebration] = useState(false)

  // 录音状态
  const [isRecording, setIsRecording] = useState(false)
  const [recordingId, setRecordingId] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [recognitionResult, setRecognitionResult] = useState('')
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  // 游戏状态
  const [gameType, setGameType] = useState('choice') 
  const [gameQuestion, setGameQuestion] = useState(null)
  const [gameOptions, setGameOptions] = useState([])
  const [spellingPool, setSpellingPool] = useState([]) 
  const [currentSpelling, setCurrentSpelling] = useState([])
  const [gameFeedback, setGameFeedback] = useState('')
  const [memoryCards, setMemoryCards] = useState([])
  const [flippedIndices, setFlippedIndices] = useState([])
  const [matchedGroups, setMatchedGroups] = useState([])

  // 表单状态 (Parent)
  const [newSentence, setNewSentence] = useState(''); const [newTranslation, setNewTranslation] = useState(''); const [newStoryName, setNewStoryName] = useState(''); const [newImageUrl, setNewImageUrl] = useState('')

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [vocRes, progRes] = await Promise.all([
        supabase.from('vocabulary').select('*').order('created_at', { ascending: true }),
        supabase.from('progress').select('*')
      ])
      setSentences(vocRes.data || [])
      const progMap = {}
      progRes.data?.forEach(p => { progMap[p.item_id] = { status: p.status, error_count: p.error_count || 0 } })
      setProgress(progMap); setDbStatus('Connected! ✅')
    } catch (err) { setDbStatus('Error: ' + err.message) } finally { setLoading(false) }
  }

  // --- 统计与分类 ---
  const soloWords = sentences.filter(s => !s.story_name)
  const storiesMap = {}; sentences.forEach(s => { if (s.story_name) (storiesMap[s.story_name] = storiesMap[s.story_name] || []).push(s) })
  const storyNames = Object.keys(storiesMap)
  const focusItems = sentences.filter(s => { const p = progress[s.id]; return !p || p.status !== 'mastered' || p.error_count > 0 })
  const totalMastered = Object.values(progress).filter(p => p.status === 'mastered').length

  // --- 音效播放器 ---
  const playSound = (type) => {
    const sounds = {
      pop: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
      success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
      correct: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3'
    }
    new Audio(sounds[type]).play().catch(()=>{})
  }

  // --- 自动 Emoji ---
  const getEmoji = (text) => {
    const map = {
      'apple': '🍎', 'banana': '🍌', 'cat': '🐱', 'dog': '🐶', 'elephant': '🐘',
      'red': '🔴', 'blue': '🔵', 'green': '🟢', 'yellow': '🟡', 'head': '🧒',
      'shoulders': '💪', 'knees': '🦵', 'toes': '👣', 'eyes': '👀', 'ears': '👂',
      'mouth': '👄', 'nose': '👃', 'hot': '🔥', 'cold': '❄️', 'big': '🐘',
      'small': '🐭', 'bird': '🐦', 'lion': '🦁', 'monkey': '🐒', 'rabbit': '🐰',
      'fish': '🐟', 'bike': '🚲', 'jump': '🦘', 'happy': '😊', 'hungry': '🍔',
      'thirsty': '🥤', 'hello': '👋', 'morning': '☀️', 'sun': '☀️', 'rain': '🌧️',
      'circle': '⭕', 'square': '⏹️', 'triangle': '🔼', 'heart': '❤️', 'star': '⭐',
      'mom': '👩', 'dad': '👨', 'sister': '👧', 'brother': '👦', 'bread': '🍞',
      'egg': '🥚', 'pizza': '🍕', 'milk': '🥛', 'sunny': '☀️', 'rainy': '🌧️',
      'snowy': '❄️', 'cloudy': '☁️', 'windy': '🌬️', 'umbrella': '☂️', 'day': '📅'
    }
    return map[text.toLowerCase().trim()] || '✨'
  }

  // --- 词汇翻页 ---
  const nextVocab = () => {
    playSound('pop')
    setVocabIndex((prev) => (prev + 1) % soloWords.length)
    setAudioUrl(null); setRecognitionResult('')
  }
  const prevVocab = () => {
    playSound('pop')
    setVocabIndex((prev) => (prev - 1 + soloWords.length) % soloWords.length)
    setAudioUrl(null); setRecognitionResult('')
  }

  // --- 游戏逻辑 ---
  const startNewGame = (type = gameType) => {
    if (sentences.length < 4) { setGameFeedback('Need 4+ items!'); return }
    setGameType(type); setGameFeedback(''); setRecognitionResult(''); setAudioUrl(null)
    const pool = studySubMode === 'focus' && focusItems.length >= 4 ? focusItems : sentences
    const question = pool[Math.floor(Math.random() * pool.length)]
    setGameQuestion(question)

    if (type === 'choice') {
      let options = [question]
      while (options.length < 4) {
        const r = sentences[Math.floor(Math.random() * sentences.length)]
        if (!options.find(o => o.id === r.id)) options.push(r)
      }
      setGameOptions(options.sort(() => Math.random() - 0.5))
    } else if (type === 'spelling') {
      const content = question.content.trim()
      const isSentence = content.includes(' ')
      let units = isSentence ? content.split(' ').map(w => w.replace(/[.,!]/g, '')) : content.toUpperCase().split('')
      setSpellingPool(units.sort(() => Math.random() - 0.5)); setCurrentSpelling([])
    } else if (type === 'memory') {
      // 连连看逻辑：选 4 个单词，生成 8 张卡片 (Content + Translation/Image)
      const pool = sentences.length >= 4 ? sentences.sort(() => 0.5 - Math.random()).slice(0, 4) : sentences
      let cards = []
      pool.forEach(item => {
        cards.push({ id: item.id, type: 'content', val: item.content, image: item.image_url })
        cards.push({ id: item.id, type: 'match', val: item.translation || item.content })
      })
      setMemoryCards(cards.sort(() => 0.5 - Math.random()))
      setFlippedIndices([]); setMatchedGroups([])
    }
    if (type !== 'memory') speak(question.content)
  }

  const handleMemoryClick = (index) => {
    if (flippedIndices.length === 2 || flippedIndices.includes(index) || matchedGroups.includes(memoryCards[index].id)) return
    playSound('pop')
    const newFlipped = [...flippedIndices, index]
    setFlippedIndices(newFlipped)

    if (newFlipped.length === 2) {
      const first = memoryCards[newFlipped[0]]
      const second = memoryCards[newFlipped[1]]
      if (first.id === second.id && first.type !== second.type) {
        // 匹配成功
        setMatchedGroups([...matchedGroups, first.id])
        setFlippedIndices([])
        speak(first.val)
        if (matchedGroups.length + 1 === memoryCards.length / 2) {
          handleGameSuccess()
        }
      } else {
        // 匹配失败
        setTimeout(() => setFlippedIndices([]), 1000)
      }
    }
  }

  const handleChoiceAnswer = (id) => {
    if (id === gameQuestion.id) handleGameSuccess()
    else { speak("No!"); recordError(gameQuestion.id) }
  }

  const handleSpellingClick = (unit, index) => {
    playSound('pop')
    const next = [...currentSpelling, unit]; setCurrentSpelling(next)
    const rem = [...spellingPool]; rem.splice(index, 1); setSpellingPool(rem)
    const isSentence = gameQuestion.content.trim().includes(' ')
    const targetText = gameQuestion.content.replace(/[.,!]/g, '')
    const targetUnits = isSentence ? targetText.split(' ') : targetText.toUpperCase().split('')
    if (next.join(isSentence ? ' ' : '') === targetUnits.join(isSentence ? ' ' : '')) handleGameSuccess()
    else if (next.length === targetUnits.length) { recordError(gameQuestion.id); setTimeout(() => startNewGame('spelling'), 1500) }
  }

  const handleGameSuccess = async () => {
    setGameFeedback('Fantastic! ⭐'); speak("Awesome!")
    setShowCelebration(true); setTimeout(() => setShowCelebration(false), 1500)
    await updateProgress(gameQuestion.id, 'mastered', true)
    setTimeout(() => startNewGame(gameType), 1500)
  }

  const recordError = async (id) => {
    const cur = progress[id] || { status: 'learning', error_count: 0 }
    await updateProgress(id, cur.status, false, cur.error_count + 1)
  }

  const updateProgress = async (itemId, status, isMastered = false, errCount = null, isVocabMode = false) => {
    const cur = progress[itemId] || { status: 'learning', error_count: 0 }
    const newErr = errCount !== null ? errCount : (isMastered ? 0 : cur.error_count)
    const { data: existing } = await supabase.from('progress').select('id').eq('item_id', itemId).single()
    if (existing) await supabase.from('progress').update({ status, error_count: newErr }).eq('item_id', itemId)
    else await supabase.from('progress').insert([{ item_id: itemId, status, error_count: newErr }])
    setProgress(prev => ({ ...prev, [itemId]: { status, error_count: newErr } }))

    if (isMastered && isVocabMode) {
      playSound('success')
      setShowCelebration(true); setTimeout(() => setShowCelebration(false), 1500)
      setTimeout(nextVocab, 1600) // 掌握后自动下一张
    }
  }

  // --- 录音 ---
  const startRecording = async (id, targetText) => {
    playSound('pop'); setRecordingId(id); setRecognitionResult(''); setAudioUrl(null); audioChunksRef.current = []
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      mediaRecorderRef.current.onstop = () => { setAudioUrl(URL.createObjectURL(new Blob(audioChunksRef.current, { type: 'audio/wav' }))) }
      mediaRecorderRef.current.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data) }
      mediaRecorderRef.current.start(); setIsRecording(true)
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SR) {
        const r = new SR(); r.lang = 'en-US'
        r.onresult = (e) => {
          const res = e.results[0][0].transcript.toLowerCase(); setRecognitionResult(res)
          if (res.includes(targetText.toLowerCase().replace(/[.,!]/g, ''))) { playSound('success'); speak("Perfect!") }
        }
        r.start()
      }
    } catch (err) { alert("Mic error!") }
  }
  const stopRecording = () => { if (mediaRecorderRef.current) mediaRecorderRef.current.stop(); setIsRecording(false) }
  const playRecording = () => { if (audioUrl) new Audio(audioUrl).play() }
  const speak = (t) => { window.speechSynthesis.cancel(); const u = new window.SpeechSynthesisUtterance(t); u.lang='en-US'; u.rate=0.8; window.speechSynthesis.speak(u) }

  // --- 管理 ---
  const handleAddSentence = async (e) => {
    e.preventDefault(); if (!newSentence.trim()) return; setIsAdding(true)
    await supabase.from('vocabulary').insert([{ content: newSentence, translation: newTranslation, story_name: newStoryName.trim() || null, image_url: newImageUrl.trim() || null, type: newStoryName.trim() ? 'story' : 'word' }])
    setNewSentence(''); setNewTranslation(''); setNewImageUrl(''); fetchData(); setIsAdding(false)
  }
  const deleteSentence = async (id) => { if (window.confirm('Delete?')) { await supabase.from('vocabulary').delete().eq('id', id); fetchData() } }

  return (
    <div className="app-container">
      {showCelebration && <div className="celebration-overlay">🌟 GOOD JOB! 🌟</div>}
      <div className="welcome-header">
        <h1 className="bouncy-title">Kids English 🌈</h1>
        <div className="dashboard-banner">
          <div className="stat-pill">⭐ {totalMastered}</div>
          <div className="stat-pill">🎯 {focusItems.length}</div>
        </div>
        <div className="mode-toggle">
          <button className={`toggle-btn bubble ${mode === 'study' ? 'active' : ''}`} onClick={() => setMode('study')}>Study</button>
          <button className={`toggle-btn bubble ${mode === 'parent' ? 'active' : ''}`} onClick={() => setMode('parent')}>Parent</button>
        </div>
      </div>

      {mode === 'parent' ? (
        <div className="card bubble-card">
          <h3>Add Lesson ✍️</h3>
          <form onSubmit={handleAddSentence} style={{marginTop:'10px'}}>
            <input type="text" value={newSentence} onChange={e=>setNewSentence(e.target.value)} placeholder="English content..." className="styled-input bubble-input" />
            <input type="text" value={newTranslation} onChange={e=>setNewTranslation(e.target.value)} placeholder="Translation..." className="styled-input bubble-input" />
            <input type="text" value={newImageUrl} onChange={e=>setNewImageUrl(e.target.value)} placeholder="Image Link..." className="styled-input bubble-input" />
            <input type="text" value={newStoryName} onChange={e=>setNewStoryName(e.target.value)} placeholder="Story Name..." className="styled-input bubble-input" />
            <button type="submit" className="btn primary-btn bubble-btn" disabled={isAdding}>Save</button>
          </form>
        </div>
      ) : (
        <div className="study-section">
          <div className="sub-mode-toggle bubble-tabs">
            <button className={studySubMode === 'words' ? 'active' : ''} onClick={()=>setStudySubMode('words')}>Vocab 🍎</button>
            <button className={studySubMode === 'stories' ? 'active' : ''} onClick={()=>setStudySubMode('stories')}>Stories 📖</button>
            <button className={studySubMode === 'games' ? 'active' : ''} onClick={()=>{setStudySubMode('games'); startNewGame();}}>Games 🎮</button>
            <button className={studySubMode === 'focus' ? 'active' : ''} onClick={()=>setStudySubMode('focus')}>Focus 🎯</button>
          </div>

          {loading ? <div className="loading-spinner">Loading...</div> : 
           studySubMode === 'words' ? (
            <div className="vocab-flashcard-mode">
              {soloWords.length > 0 ? (
                <div className="flashcard-container">
                  <button onClick={prevVocab} className="nav-arrow left bubble">⬅️</button>
                  
                  <div key={soloWords[vocabIndex].id} className={`sentence-card bubble-card bubble-ani featured-card ${progress[soloWords[vocabIndex].id]?.status==='mastered' ? 'mastered' : ''}`}>
                    <div className="card-visual">
                      {soloWords[vocabIndex].image_url ? <img src={soloWords[vocabIndex].image_url} alt="" className="word-img" /> : <div className="word-emoji">{getEmoji(soloWords[vocabIndex].content)}</div>}
                    </div>
                    <div className="sentence-content large">{soloWords[vocabIndex].content}</div>
                    <div className="mimic-box">
                      {recordingId === soloWords[vocabIndex].id && <div className="recognition-hint">{isRecording ? "Listening..." : recognitionResult ? `You: "${recognitionResult}"` : ""}</div>}
                      <div className="card-actions">
                        <button onClick={() => speak(soloWords[vocabIndex].content)} className="action-btn listen-btn bubble">Std 🔊</button>
                        {!isRecording ? <button onClick={() => startRecording(soloWords[vocabIndex].id, soloWords[vocabIndex].content)} className="action-btn record-btn bubble">Mimic 🎙️</button> : (recordingId === soloWords[vocabIndex].id && <button onClick={stopRecording} className="action-btn stop-btn bubble">Done ✅</button>)}
                        {audioUrl && recordingId === soloWords[vocabIndex].id && <button onClick={playRecording} className="action-btn play-mine-btn bubble">Me 🎧</button>}
                        <button onClick={() => updateProgress(soloWords[vocabIndex].id, progress[soloWords[vocabIndex].id]?.status === 'mastered' ? 'learning' : 'mastered', progress[soloWords[vocabIndex].id]?.status !== 'mastered', null, true)} className={`action-btn check-btn bubble ${progress[soloWords[vocabIndex].id]?.status==='mastered' ? 'is-mastered' : ''}`}>{progress[soloWords[vocabIndex].id]?.status==='mastered' ? '⭐' : '✔️'}</button>
                      </div>
                    </div>
                  </div>

                  <button onClick={nextVocab} className="nav-arrow right bubble">➡️</button>
                </div>
              ) : <p>No words yet.</p>}
              <div className="vocab-progress-dots">
                {soloWords.map((_, i) => <div key={i} className={`dot ${i === vocabIndex ? 'active' : ''}`} onClick={()=>setVocabIndex(i)}></div>)}
              </div>
            </div>
           ) : studySubMode === 'stories' ? (
            <div className="stories-list">
              {storyNames.map(name => (
                <div key={name} className="story-book bubble-card">
                  <h2 className="story-title">📖 {name}</h2>
                  <div className="story-chat">
                    {storiesMap[name].map(line => (
                      <div key={line.id} className="chat-bubble bubble-ani" onClick={()=>speak(line.content)}>
                        {line.image_url ? <img src={line.image_url} alt="" className="chat-img" /> : <div className="chat-emoji">{getEmoji(line.content.split(' ').slice(-1)[0])}</div>}
                        <div className="chat-text">{line.content}</div>
                        {line.translation && <div className="chat-trans">{line.translation}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
           ) : studySubMode === 'games' ? (
            <div className="game-box">
              <div className="game-selector">
                <button onClick={()=>startNewGame('choice')} className={gameType==='choice'?'active bubble':''}>Choice</button>
                <button onClick={()=>startNewGame('spelling')} className={gameType==='spelling'?'active bubble':''}>Spell</button>
                <button onClick={()=>startNewGame('memory')} className={gameType==='memory'?'active bubble':''}>Match</button>
              </div>
              <div className="card game-card bubble-card">
                <div className="game-visual">
                  {gameQuestion?.image_url ? <img src={gameQuestion.image_url} alt="" className="game-img" /> : <div className="game-emoji-large bubble-ani">{getEmoji(gameQuestion?.content.split(' ').slice(-1)[0] || '')}</div>}
                </div>
                <h3>{gameType==='choice' ? 'What is this?' : 'Spell it!'} 🎧</h3>
                <button onClick={()=>speak(gameQuestion?.content)} className="btn repeat-btn bubble-btn">🔊 Repeat</button>
                {gameType === 'choice' ? (
                  <div className="game-options">
                    {gameOptions.map(opt => (<button key={opt.id} onClick={()=>handleChoiceAnswer(opt.id)} className="game-option-btn bubble">{opt.translation || opt.content}</button>))}
                  </div>
                ) : gameType === 'spelling' ? (
                  <div className="spelling-area">
                    <div className="spelling-display">
                      {currentSpelling.map((u, i) => <span key={i} className={`letter-slot bubble-ani ${gameQuestion?.content.includes(' ') ? 'word-slot' : ''}`}>{u}</span>)}
                      {gameQuestion && Array(Math.max(0, (gameQuestion.content.trim().includes(' ') ? gameQuestion.content.replace(/[.,!]/g, '').split(' ').length : gameQuestion.content.replace(/[^A-Z]/gi, '').length) - currentSpelling.length)).fill(0).map((_, i) => <span key={i} className={`letter-slot empty bubble-ani ${gameQuestion?.content.includes(' ') ? 'word-slot' : ''}`}>_</span>)}
                    </div>
                    <div className="letter-pool">
                      {spellingPool.map((u, i) => (<button key={i} onClick={()=>handleSpellingClick(u, i)} className={`letter-btn bubble ${gameQuestion?.content.includes(' ') ? 'word-btn' : ''}`}>{u}</button>))}
                    </div>
                  </div>
                ) : (
                  <div className="memory-grid">
                    {memoryCards.map((card, i) => (
                      <div key={i} 
                           className={`memory-card bubble ${flippedIndices.includes(i) || matchedGroups.includes(card.id) ? 'flipped' : ''} ${matchedGroups.includes(card.id) ? 'matched' : ''}`}
                           onClick={() => handleMemoryClick(i)}>
                        <div className="card-front">
                          {card.type === 'content' && card.image ? <img src={card.image} alt="" className="mini-img" /> : (card.type === 'content' ? getEmoji(card.val) : card.val)}
                        </div>
                        <div className="card-back">❓</div>
                      </div>
                    ))}
                  </div>
                )}
                {gameFeedback && <div className={`game-feedback bubble-ani ${gameFeedback.includes('Fantastic') ? 'success' : 'fail'}`}>{gameFeedback}</div>}
              </div>
            </div>
           ) : (
            <div className="sentences-grid">
              {focusItems.map(item => (
                <div key={item.id} className="sentence-card bubble-card bubble-ani error-focus">
                  <div className="error-badge">Err: {progress[item.id]?.error_count || 0}</div>
                  <div className="card-visual">
                    {item.image_url ? <img src={item.image_url} alt="" className="word-img" /> : <div className="word-emoji">{getEmoji(item.content)}</div>}
                  </div>
                  <div className="sentence-content">{item.content}</div>
                  <div className="card-actions">
                    <button onClick={() => speak(item.content)} className="action-btn listen-btn bubble">Std 🔊</button>
                    <button onClick={() => updateProgress(item.id, 'mastered', true)} className="action-btn check-btn bubble">Done ✔️</button>
                  </div>
                </div>
              ))}
            </div>
           )
          }
        </div>
      )}
      <div className="footer-status">DB: {dbStatus}</div>
    </div>
  )
}

export default App
