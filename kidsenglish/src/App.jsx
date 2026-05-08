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

  // 表单状态 (Parent)
  const [newSentence, setNewSentence] = useState('')
  const [newTranslation, setNewTranslation] = useState('')
  const [newStoryName, setNewStoryName] = useState('')
  const [newImageUrl, setNewImageUrl] = useState('') // 支持外部图片

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

  // --- 自动 Emoji 映射 (为小朋友增加趣味性) ---
  const getEmoji = (text) => {
    const map = {
      'apple': '🍎', 'banana': '🍌', 'cat': '🐱', 'dog': '🐶', 'elephant': '🐘',
      'red': '🔴', 'blue': '🔵', 'green': '🟢', 'yellow': '🟡', 'head': '🧒',
      'shoulders': '💪', 'knees': '🦵', 'toes': '👣', 'eyes': '👀', 'ears': '👂',
      'mouth': '👄', 'nose': '👃', 'hot': '🔥', 'cold': '❄️', 'big': '🐘',
      'small': '🐭', 'bird': '🐦', 'lion': '🦁', 'monkey': '🐒', 'rabbit': '🐰',
      'fish': '🐟', 'bike': '🚲', 'jump': '🦘', 'happy': '😊', 'hungry': '🍔',
      'thirsty': '🥤', 'hello': '👋', 'morning': '☀️', 'sun': '☀️', 'rain': '🌧️'
    }
    return map[text.toLowerCase().trim()] || '✨'
  }

  // --- 核心逻辑 ---
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
    } else {
      const content = question.content.trim()
      const isSentence = content.includes(' ')
      let units = isSentence ? content.split(' ').map(w => w.replace(/[.,!]/g, '')) : content.toUpperCase().split('')
      setSpellingPool(units.sort(() => Math.random() - 0.5)); setCurrentSpelling([])
    }
    speak(question.content)
  }

  const handleChoiceAnswer = (id) => {
    if (id === gameQuestion.id) handleGameSuccess()
    else { setGameFeedback('Try again! 💪'); recordError(gameQuestion.id) }
  }

  const handleSpellingClick = (unit, index) => {
    const next = [...currentSpelling, unit]; setCurrentSpelling(next)
    const rem = [...spellingPool]; rem.splice(index, 1); setSpellingPool(rem)
    const isSentence = gameQuestion.content.trim().includes(' ')
    const targetText = gameQuestion.content.replace(/[.,!]/g, '')
    const targetUnits = isSentence ? targetText.split(' ') : targetText.toUpperCase().split('')
    if (next.join(isSentence ? ' ' : '') === targetUnits.join(isSentence ? ' ' : '')) handleGameSuccess()
    else if (next.length === targetUnits.length) { setGameFeedback('Try again!'); recordError(gameQuestion.id); setTimeout(() => startNewGame('spelling'), 1500) }
  }

  const handleGameSuccess = async () => {
    setGameFeedback('Fantastic! ⭐'); speak("You did it!")
    await updateProgress(gameQuestion.id, 'mastered', true)
    setTimeout(() => startNewGame(gameType), 1500)
  }

  const recordError = async (id) => {
    const cur = progress[id] || { status: 'learning', error_count: 0 }
    await updateProgress(id, cur.status, false, cur.error_count + 1)
  }

  const updateProgress = async (itemId, status, isMastered = false, errCount = null) => {
    const cur = progress[itemId] || { status: 'learning', error_count: 0 }
    const newErr = errCount !== null ? errCount : (isMastered ? 0 : cur.error_count)
    const { data: existing } = await supabase.from('progress').select('id').eq('item_id', itemId).single()
    if (existing) await supabase.from('progress').update({ status, error_count: newErr }).eq('item_id', itemId)
    else await supabase.from('progress').insert([{ item_id: itemId, status, error_count: newErr }])
    setProgress(prev => ({ ...prev, [itemId]: { status, error_count: newErr } }))
  }

  // --- 录音与发音 ---
  const startRecording = async (id, targetText) => {
    setRecordingId(id); setRecognitionResult(''); setAudioUrl(null); audioChunksRef.current = []
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      mediaRecorderRef.current.onstop = () => { setAudioUrl(URL.createObjectURL(new Blob(audioChunksRef.current, { type: 'audio/wav' }))) }
      mediaRecorderRef.current.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data) }
      mediaRecorderRef.current.start(); setIsRecording(true)
      const SR = window.SpeechRecognition || window.webkitRecognition || window.webkitSpeechRecognition
      if (SR) {
        const r = new SR(); r.lang = 'en-US'
        r.onresult = (e) => {
          const res = e.results[0][0].transcript.toLowerCase(); setRecognitionResult(res)
          if (res.includes(targetText.toLowerCase().replace(/[.,!]/g, ''))) speak("Perfect match!")
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
    await supabase.from('vocabulary').insert([{ 
      content: newSentence, 
      translation: newTranslation, 
      story_name: newStoryName.trim() || null, 
      image_url: newImageUrl.trim() || null,
      type: newStoryName.trim() ? 'story' : 'word' 
    }])
    setNewSentence(''); setNewTranslation(''); setNewImageUrl(''); fetchData(); setIsAdding(false)
  }
  const deleteSentence = async (id) => { if (window.confirm('Delete?')) { await supabase.from('vocabulary').delete().eq('id', id); fetchData() } }

  const totalMastered = Object.values(progress).filter(p => p.status === 'mastered').length
  const focusItems = sentences.filter(s => { const p = progress[s.id]; return !p || p.status !== 'mastered' || p.error_count > 0 })
  const soloWords = sentences.filter(s => !s.story_name)
  const storiesMap = {}
  sentences.forEach(s => { if (s.story_name) (storiesMap[s.story_name] = storiesMap[s.story_name] || []).push(s) })

  return (
    <div className="app-container">
      <div className="welcome-header">
        <h1>Kids English 🌈</h1>
        <div className="dashboard-banner">
          <div className="stat-pill">⭐ {totalMastered}</div>
          <div className="stat-pill">🎯 {focusItems.length}</div>
        </div>
        <div className="mode-toggle">
          <button className={`toggle-btn ${mode === 'study' ? 'active' : ''}`} onClick={() => setMode('study')}>Study</button>
          <button className={`toggle-btn ${mode === 'parent' ? 'active' : ''}`} onClick={() => setMode('parent')}>Parent</button>
        </div>
      </div>

      {mode === 'parent' ? (
        <div className="card">
          <h3>Add Lesson</h3>
          <form onSubmit={handleAddSentence} style={{marginTop:'10px'}}>
            <input type="text" value={newSentence} onChange={e=>setNewSentence(e.target.value)} placeholder="English content..." className="styled-input" />
            <input type="text" value={newTranslation} onChange={e=>setNewTranslation(e.target.value)} placeholder="Translation..." className="styled-input" />
            <input type="text" value={newImageUrl} onChange={e=>setNewImageUrl(e.target.value)} placeholder="Image Link (Optional)..." className="styled-input" />
            <input type="text" value={newStoryName} onChange={e=>setNewStoryName(e.target.value)} placeholder="Story Name..." className="styled-input" />
            <button type="submit" className="btn primary-btn" disabled={isAdding}>Save</button>
          </form>
          <div className="manage-list" style={{marginTop:'20px'}}>
            {sentences.map(s => (
              <div key={s.id} className="manage-item"><span>[{s.story_name || 'Word'}] {s.content}</span><button onClick={()=>deleteSentence(s.id)} className="delete-btn">X</button></div>
            ))}
          </div>
        </div>
      ) : (
        <div className="study-section">
          <div className="sub-mode-toggle">
            <button className={studySubMode === 'words' ? 'active' : ''} onClick={()=>setStudySubMode('words')}>Vocab</button>
            <button className={studySubMode === 'stories' ? 'active' : ''} onClick={()=>setStudySubMode('stories')}>Stories</button>
            <button className={studySubMode === 'games' ? 'active' : ''} onClick={()=>{setStudySubMode('games'); startNewGame();}}>Games</button>
            <button className={studySubMode === 'focus' ? 'active' : ''} onClick={()=>setStudySubMode('focus')}>Focus 🎯</button>
          </div>

          {loading ? <p>Loading...</p> : 
           studySubMode === 'stories' ? (
            <div className="stories-list">
              {Object.keys(storiesMap).map(name => (
                <div key={name} className="story-book">
                  <h2 className="story-title">📖 {name}</h2>
                  <div className="story-chat">
                    {storiesMap[name].map(line => (
                      <div key={line.id} className="chat-bubble" onClick={()=>speak(line.content)}>
                        {line.image_url ? (
                          <img src={line.image_url} alt="" className="chat-img" />
                        ) : <div className="chat-emoji">{getEmoji(line.content.split(' ').slice(-1)[0])}</div>}
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
                <button onClick={()=>startNewGame('choice')} className={gameType==='choice'?'active':''}>Choice</button>
                <button onClick={()=>startNewGame('spelling')} className={gameType==='spelling'?'active':''}>Spell</button>
              </div>
              <div className="card game-card">
                <div className="game-visual">
                  {gameQuestion?.image_url ? (
                    <img src={gameQuestion.image_url} alt="" className="game-img" />
                  ) : <div className="game-emoji-large">{getEmoji(gameQuestion?.content.split(' ').slice(-1)[0] || '')}</div>}
                </div>
                <h3>{gameType==='choice' ? 'What is this?' : 'Spell it!'} 🎧</h3>
                <button onClick={()=>speak(gameQuestion?.content)} className="btn repeat-btn">🔊</button>
                {gameType === 'choice' ? (
                  <div className="game-options">
                    {gameOptions.map(opt => (<button key={opt.id} onClick={()=>handleChoiceAnswer(opt.id)} className="game-option-btn">{opt.translation || opt.content}</button>))}
                  </div>
                ) : (
                  <div className="spelling-area">
                    <div className="spelling-display">
                      {currentSpelling.map((u, i) => <span key={i} className={`letter-slot ${gameQuestion?.content.includes(' ') ? 'word-slot' : ''}`}>{u}</span>)}
                      {gameQuestion && Array(Math.max(0, (gameQuestion.content.trim().includes(' ') ? gameQuestion.content.replace(/[.,!]/g, '').split(' ').length : gameQuestion.content.replace(/[^A-Z]/gi, '').length) - currentSpelling.length)).fill(0).map((_, i) => <span key={i} className={`letter-slot empty ${gameQuestion?.content.includes(' ') ? 'word-slot' : ''}`}>_</span>)}
                    </div>
                    <div className="letter-pool">
                      {spellingPool.map((u, i) => (<button key={i} onClick={()=>handleSpellingClick(u, i)} className={`letter-btn ${gameQuestion?.content.includes(' ') ? 'word-btn' : ''}`}>{u}</button>))}
                    </div>
                  </div>
                )}
                {gameFeedback && <div className={`game-feedback ${gameFeedback.includes('Fantastic') ? 'success' : 'fail'}`}>{gameFeedback}</div>}
              </div>
            </div>
           ) : (
            <div className="sentences-grid">
              {(studySubMode === 'focus' ? focusItems : soloWords).map(item => (
                <div key={item.id} className={`sentence-card ${progress[item.id]?.status==='mastered' ? 'mastered' : ''} ${studySubMode==='focus'?'error-focus':''}`}>
                  {studySubMode === 'focus' && <div className="error-badge">Err: {progress[item.id]?.error_count || 0}</div>}
                  
                  {/* 图片展示区 */}
                  <div className="card-visual">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.content} className="word-img" />
                    ) : (
                      <div className="word-emoji">{getEmoji(item.content)}</div>
                    )}
                  </div>

                  <div className="sentence-content">{item.content}</div>
                  <div className="mimic-box">
                    {recordingId === item.id && <div className="recognition-hint">{isRecording ? "Listening..." : recognitionResult ? `You: "${recognitionResult}"` : ""}</div>}
                    <div className="card-actions">
                      <button onClick={() => speak(item.content)} className="action-btn listen-btn">Std 🔊</button>
                      {!isRecording ? <button onClick={() => startRecording(item.id, item.content)} className="action-btn record-btn">Mimic 🎙️</button> : (recordingId === item.id && <button onClick={stopRecording} className="action-btn stop-btn">Done ✅</button>)}
                      {audioUrl && recordingId === item.id && <button onClick={playRecording} className="action-btn play-mine-btn">Me 🎧</button>}
                      <button onClick={() => updateProgress(item.id, progress[item.id]?.status === 'mastered' ? 'learning' : 'mastered', progress[item.id]?.status !== 'mastered')} className={`action-btn check-btn ${progress[item.id]?.status==='mastered' ? 'is-mastered' : ''}`}>{progress[item.id]?.status==='mastered' ? '⭐' : '✔️'}</button>
                    </div>
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
