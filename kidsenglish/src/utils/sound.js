// Web Audio API 纯合成可爱音效生成器（免外部网络加载，100%可靠，无杂音）
let audioCtx = null

// 音效全局开关状态（默认开启，支持持久化）
let soundEnabled = true
try {
  const saved = localStorage.getItem('kids_sound_enabled')
  if (saved !== null) {
    soundEnabled = saved === 'true'
  }
} catch (e) {}

export function setSoundEnabled(val) {
  soundEnabled = !!val
  try {
    localStorage.setItem('kids_sound_enabled', String(soundEnabled))
  } catch (e) {}
}

export function getSoundEnabled() {
  return soundEnabled
}

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

// 泡泡爆破声（点击、切换）
export function playPop() {
  if (!soundEnabled) return
  const ctx = getAudioContext()
  if (!ctx) return
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(450, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08)
  
  gain.gain.setValueAtTime(0.2, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08)
  
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + 0.09)
}

// 答对提示音（清脆甜美的和弦）
export function playCorrect() {
  if (!soundEnabled) return
  const ctx = getAudioContext()
  if (!ctx) return
  const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.value = freq
    
    const startTime = ctx.currentTime + idx * 0.07
    gain.gain.setValueAtTime(0, startTime)
    gain.gain.linearRampToValueAtTime(0.25, startTime + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25)
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(startTime)
    osc.stop(startTime + 0.26)
  })
}

// 通关欢呼大和弦（庆祝、发奖章）
export function playCheer() {
  if (!soundEnabled) return
  const ctx = getAudioContext()
  if (!ctx) return
  const chords = [
    [523.25, 659.25, 783.99],
    [587.33, 739.99, 880.00],
    [659.25, 830.61, 987.77],
    [1046.5, 1318.51, 1567.98]
  ]
  chords.forEach((chord, step) => {
    const t = ctx.currentTime + step * 0.12
    chord.forEach(freq => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(0.18, t + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.001, t + (step === 3 ? 0.6 : 0.2))
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.65)
    })
  })
}

// 魔法星星音（获得贴纸、躲猫猫变身）
export function playMagic() {
  if (!soundEnabled) return
  const ctx = getAudioContext()
  if (!ctx) return
  for (let i = 0; i < 8; i++) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(700 + i * 150 + Math.random() * 80, ctx.currentTime + i * 0.05)
    
    gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.05)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.05 + 0.15)
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime + i * 0.05)
    osc.stop(ctx.currentTime + i * 0.05 + 0.16)
  }
}

// 答错轻柔提示音（萌趣嘟嘟，不挫败小朋友积极性）
export function playTryAgain() {
  if (!soundEnabled) return
  const ctx = getAudioContext()
  if (!ctx) return
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(320, ctx.currentTime)
  osc.frequency.linearRampToValueAtTime(240, ctx.currentTime + 0.15)
  
  gain.gain.setValueAtTime(0.2, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18)
  
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + 0.2)
}
