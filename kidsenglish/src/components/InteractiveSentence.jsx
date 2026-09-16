import React from 'react'

/**
 * 将整句英文自动拆解为可单独点击的单词单元
 * 当小朋友点击任意单词时，触发 onWordClick(word) 弹出发音与音标释义卡
 */
export function InteractiveSentence({ text, onWordClick, className = '' }) {
  if (!text) return null

  // 匹配单词词元与非单词符号（保留标点和空格格式）
  const tokens = text.split(/([a-zA-Z]+(?:'[a-zA-Z]+)?)/g)

  return (
    <span className={`interactive-sentence-wrap ${className}`}>
      {tokens.map((token, index) => {
        // 如果是纯英文单词
        const isWord = /^[a-zA-Z]+(?:'[a-zA-Z]+)?$/.test(token)

        if (isWord) {
          return (
            <span
              key={index}
              className="clickable-word-token"
              title={`点击查看 "${token}" 音标与中英释义`}
              onClick={(e) => {
                e.stopPropagation()
                if (onWordClick) {
                  onWordClick(token)
                }
              }}
            >
              {token}
            </span>
          )
        }

        // 普通标点符号或空格
        return <span key={index} className="sentence-punct-token">{token}</span>
      })}
    </span>
  )
}
