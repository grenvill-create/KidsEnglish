// 语音引擎：Web Speech API 朗读封装（支持英语童音/慢速模式及中文拼音朗读）
let voices = []

function initVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  voices = window.speechSynthesis.getVoices()
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices()
    }
  }
}

initVoices()

export function stopSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}

export function speakEnglish(text, isSlow = false, onEnd = null) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  stopSpeech()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US'
  // 乌龟慢速 0.65x，兔子常速 0.95x，轻微提频至 1.15 呈现童声轻快亲和感
  utterance.rate = isSlow ? 0.65 : 0.95
  utterance.pitch = 1.15

  // 优选高品质美音发音人（如 Natural, Google, Samantha, Jenny）
  if (voices.length === 0) {
    voices = window.speechSynthesis.getVoices()
  }
  const preferredVoice = voices.find(v => 
    v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Jenny') || v.name.includes('Samantha') || v.name.includes('Google US'))
  ) || voices.find(v => v.lang.startsWith('en'))

  if (preferredVoice) {
    utterance.voice = preferredVoice
  }

  if (onEnd) {
    utterance.onend = onEnd
    utterance.onerror = onEnd
  }

  window.speechSynthesis.speak(utterance)
}

export function speakChinese(text, isSlow = false, onEnd = null) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  stopSpeech()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'zh-CN'
  utterance.rate = isSlow ? 0.7 : 0.95
  utterance.pitch = 1.1

  if (voices.length === 0) {
    voices = window.speechSynthesis.getVoices()
  }
  const preferredVoice = voices.find(v => 
    v.lang.startsWith('zh') && (v.name.includes('Natural') || v.name.includes('Xiaoxiao') || v.name.includes('Tingting') || v.name.includes('Google 普通话'))
  ) || voices.find(v => v.lang.startsWith('zh'))

  if (preferredVoice) {
    utterance.voice = preferredVoice
  }

  if (onEnd) {
    utterance.onend = onEnd
    utterance.onerror = onEnd
  }

  window.speechSynthesis.speak(utterance)
}
