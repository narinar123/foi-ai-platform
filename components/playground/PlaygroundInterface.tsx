'use client'

import React, { useState } from 'react'
import { useChat } from 'ai/react'
import { Bot, Send, User } from 'lucide-react'
import styles from './Playground.module.css'

export default function PlaygroundInterface() {
  const [modelA, setModelA] = useState('gpt-4o')
  const [modelB, setModelB] = useState('claude-sonnet')

  const {
    messages: messagesA,
    input: inputA,
    handleInputChange: handleInputChangeA,
    handleSubmit: handleSubmitA,
    isLoading: isLoadingA
  } = useChat({ api: '/api/chat', body: { model: modelA } })

  const {
    messages: messagesB,
    input: inputB,
    handleInputChange: handleInputChangeB,
    handleSubmit: handleSubmitB,
    isLoading: isLoadingB,
    setInput: setInputB
  } = useChat({ api: '/api/chat', body: { model: modelB } })

  const handleGlobalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputA.trim()) return
    // Ensure both get the exact same prompt
    const prompt = inputA
    setInputB(prompt)
    handleSubmitA(e)
    
    // For B, we need to artificially create an event or use append
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent
    handleSubmitB(fakeEvent)
  }

  const modelOptions = [
    { value: 'gpt-4o', label: 'GPT-4o' },
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
    { value: 'claude-sonnet', label: 'Claude 3.5 Sonnet' },
    { value: 'claude-haiku', label: 'Claude 3.5 Haiku' },
    { value: 'gemini-pro', label: 'Gemini 1.5 Pro' },
    { value: 'gemini-flash', label: 'Gemini 1.5 Flash' }
  ]

  return (
    <div className={styles.playground}>
      <header className={styles.header}>
        <h2>Arena Playground</h2>
        <p>Compare models side-by-side</p>
      </header>

      <div className={styles.splitView}>
        {/* Model A */}
        <div className={styles.pane}>
          <div className={styles.paneHeader}>
            <select value={modelA} onChange={(e) => setModelA(e.target.value)}>
              {modelOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div className={styles.chatArea}>
            {messagesA.map(m => (
              <div key={m.id} className={`${styles.message} ${m.role === 'user' ? styles.user : styles.ai}`}>
                <div className={styles.avatar}>
                  {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={styles.content}>{m.content}</div>
              </div>
            ))}
            {isLoadingA && <div className={styles.loading}>Model A is thinking...</div>}
          </div>
        </div>

        {/* Model B */}
        <div className={styles.pane}>
          <div className={styles.paneHeader}>
            <select value={modelB} onChange={(e) => setModelB(e.target.value)}>
              {modelOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div className={styles.chatArea}>
            {messagesB.map(m => (
              <div key={m.id} className={`${styles.message} ${m.role === 'user' ? styles.user : styles.ai}`}>
                <div className={styles.avatar}>
                  {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={styles.content}>{m.content}</div>
              </div>
            ))}
            {isLoadingB && <div className={styles.loading}>Model B is thinking...</div>}
          </div>
        </div>
      </div>

      <form className={styles.inputArea} onSubmit={handleGlobalSubmit}>
        <input
          value={inputA}
          onChange={(e) => {
            handleInputChangeA(e)
            handleInputChangeB(e)
          }}
          placeholder="Send a prompt to both models..."
          className={styles.input}
        />
        <button type="submit" disabled={!inputA.trim() || isLoadingA || isLoadingB} className={styles.sendBtn}>
          <Send size={18} />
        </button>
      </form>
    </div>
  )
}
