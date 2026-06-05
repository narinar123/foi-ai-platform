'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, Mic, Paperclip, Code2, AtSign, Hash,
  ChevronDown, Folder, Sparkles, Bot, Loader2,
  User, Copy, RotateCcw, ThumbsUp, ThumbsDown
} from 'lucide-react'
import styles from './ChatInterface.module.css'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  toolCalls?: ToolCall[]
  timestamp: Date
}

interface ToolCall {
  name: string
  status: 'running' | 'done' | 'error'
  result?: string
}

const MODELS = [
  { id: 'gpt-4o', label: 'GPT-4o', provider: 'openai' },
  { id: 'claude-sonnet', label: 'Claude Sonnet', provider: 'anthropic' },
  { id: 'gemini-pro', label: 'Gemini Pro', provider: 'google' },
  { id: 'ollama-llama3', label: 'Llama 3 (Local)', provider: 'ollama' },
]

const CHANNELS = [
  { id: 'general', label: 'General' },
  { id: 'code', label: 'Code' },
  { id: 'research', label: 'Research' },
  { id: 'automation', label: 'Automation' },
]

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState(MODELS[0])
  const [selectedChannel, setSelectedChannel] = useState(CHANNELS[0])
  const [showModelMenu, setShowModelMenu] = useState(false)
  const [showChannelMenu, setShowChannelMenu] = useState(false)
  const [workInFolder, setWorkInFolder] = useState(false)
  const [showExpandedTools, setShowExpandedTools] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const autoResize = () => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 200) + 'px'
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    setIsLoading(true)

    // Simulate AI response with tool calls
    const assistantId = (Date.now() + 1).toString()
    const toolCallExample: ToolCall = {
      name: 'web_search',
      status: 'running',
    }

    // Add assistant message with streaming effect
    const assistantMsg: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      toolCalls: [toolCallExample],
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, assistantMsg])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          model: selectedModel.id,
          channel: selectedChannel.id,
        }),
      })

      if (!response.ok) throw new Error('API error')
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value)
          // Parse SSE data
          const lines = chunk.split('\n')
          for (const line of lines) {
            if (line.startsWith('0:')) {
              const text = line.slice(2).replace(/^"/, '').replace(/"$/, '').replace(/\\n/g, '\n')
              fullContent += text
              setMessages(prev => prev.map(m =>
                m.id === assistantId ? {
                  ...m,
                  content: fullContent,
                  toolCalls: m.toolCalls?.map(tc => ({ ...tc, status: 'done' as const }))
                } : m
              ))
            }
          }
        }
      }
    } catch {
      // Fallback response
      const responses = [
        "I understand your request. Let me analyze this and provide a comprehensive solution...\n\nBased on my analysis, here's what I recommend:\n\n1. **First step**: Set up the foundation\n2. **Second step**: Configure the integrations  \n3. **Third step**: Test and optimize\n\nWould you like me to proceed with executing any of these steps?",
        "Great task! I'll plan and execute this for you using available agentic skills.\n\n**Plan:**\n- Research best approaches\n- Set up automation via n8n\n- Configure MCP connectors\n- Deploy and monitor\n\nShall I start?",
        "I've analyzed your request. Here's my execution plan:\n\n```typescript\n// Agentic workflow\nconst workflow = {\n  steps: ['analyze', 'plan', 'execute', 'verify'],\n  tools: ['web_search', 'code_gen', 'n8n_trigger'],\n  model: 'gpt-4o'\n}\n```\n\nReady to execute when you confirm!",
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setMessages(prev => prev.map(m =>
        m.id === assistantId ? {
          ...m,
          content: randomResponse,
          toolCalls: m.toolCalls?.map(tc => ({ ...tc, status: 'done' as const, result: 'Completed' }))
        } : m
      ))
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className={styles.container}>
      {/* Empty State */}
      {messages.length === 0 && (
        <div className={styles.emptyState}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.logoMark}>
              <Sparkles size={28} />
            </div>
            <h1 className={styles.heroTitle}>Beyond chat, get it done.</h1>
            <p className={styles.heroSub}>
              Just tell foi.ai what you need — it plans, executes, and delivers, keeping you in the loop.
            </p>
          </motion.div>

          {/* Suggestion chips */}
          <motion.div
            className={styles.suggestions}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {[
              '🔄 Set up n8n automation workflow',
              '🤖 Build an AI agent for research',
              '📁 Organise my project files',
              '🚀 Deploy my app to Vercel',
              '📊 Create a data analysis pipeline',
              '🔌 Configure MCP connectors',
            ].map(s => (
              <button
                key={s}
                className={styles.suggestion}
                onClick={() => setInput(s.slice(3))}
              >
                {s}
              </button>
            ))}
          </motion.div>
        </div>
      )}

      {/* Messages */}
      {messages.length > 0 && (
        <div className={styles.messages}>
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.assistantMessage}`}
              >
                <div className={styles.messageAvatar}>
                  {msg.role === 'user' ? (
                    <div className={styles.userAvatar}><User size={14} /></div>
                  ) : (
                    <div className={styles.aiAvatar}><Bot size={14} /></div>
                  )}
                </div>
                <div className={styles.messageBody}>
                  {/* Tool calls */}
                  {msg.toolCalls && msg.toolCalls.length > 0 && (
                    <div className={styles.toolCalls}>
                      {msg.toolCalls.map((tc, i) => (
                        <div key={i} className={`${styles.toolCall} ${tc.status === 'running' ? styles.toolRunning : styles.toolDone}`}>
                          {tc.status === 'running' ? (
                            <Loader2 size={12} className={styles.spin} />
                          ) : (
                            <span className={styles.toolDoneIcon}>✓</span>
                          )}
                          <span className={styles.toolName}>{tc.name}</span>
                          <span className={styles.toolStatus}>
                            {tc.status === 'running' ? 'Executing...' : tc.result || 'Done'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Content */}
                  <div className={styles.messageContent}>
                    {msg.content || (isLoading && msg.role === 'assistant' && (
                      <div className={styles.typingDots}>
                        <span /><span /><span />
                      </div>
                    ))}
                  </div>
                  {/* Actions */}
                  {msg.role === 'assistant' && msg.content && (
                    <div className={styles.messageActions}>
                      <button className={styles.actionBtn} title="Copy"><Copy size={12} /></button>
                      <button className={styles.actionBtn} title="Regenerate"><RotateCcw size={12} /></button>
                      <button className={styles.actionBtn} title="Good"><ThumbsUp size={12} /></button>
                      <button className={styles.actionBtn} title="Bad"><ThumbsDown size={12} /></button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input Area */}
      <div className={styles.inputArea}>
        <div className={styles.inputBox}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => { setInput(e.target.value); autoResize() }}
            onKeyDown={handleKeyDown}
            placeholder="Describe a task, / for shortcuts, @ to add context"
            className={styles.textarea}
            rows={1}
          />
          <div className={styles.inputToolbar}>
            <div className={styles.inputTools}>
              <button className={styles.toolBtn} title="Attach file"><Paperclip size={15} /></button>
              <button className={styles.toolBtn} title="Code"><Code2 size={15} /></button>
              <button className={styles.toolBtn} title="Add context"><AtSign size={15} /></button>

              {/* Channel Selector */}
              <div className={styles.menuWrap}>
                <button
                  className={styles.selectorBtn}
                  onClick={() => { setShowChannelMenu(!showChannelMenu); setShowModelMenu(false) }}
                >
                  <Hash size={13} />
                  {selectedChannel.label}
                  <ChevronDown size={11} />
                </button>
                <AnimatePresence>
                  {showChannelMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.97 }}
                      className={styles.dropdown}
                    >
                      {CHANNELS.map(c => (
                        <button
                          key={c.id}
                          className={`${styles.dropdownItem} ${c.id === selectedChannel.id ? styles.dropdownActive : ''}`}
                          onClick={() => { setSelectedChannel(c); setShowChannelMenu(false) }}
                        >
                          <Hash size={12} /> {c.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Model Selector */}
              <div className={styles.menuWrap}>
                <button
                  className={styles.selectorBtn}
                  onClick={() => { setShowModelMenu(!showModelMenu); setShowChannelMenu(false) }}
                >
                  <Bot size={13} />
                  {selectedModel.label}
                  <ChevronDown size={11} />
                </button>
                <AnimatePresence>
                  {showModelMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.97 }}
                      className={styles.dropdown}
                    >
                      {MODELS.map(m => (
                        <button
                          key={m.id}
                          className={`${styles.dropdownItem} ${m.id === selectedModel.id ? styles.dropdownActive : ''}`}
                          onClick={() => { setSelectedModel(m); setShowModelMenu(false) }}
                        >
                          <Bot size={12} /> {m.label}
                          <span className={styles.providerBadge}>{m.provider}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className={styles.inputRight}>
              <button className={styles.micBtn} title="Voice input"><Mic size={15} /></button>
              <button
                className={`${styles.sendBtn} ${input.trim() ? styles.sendActive : ''}`}
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
              >
                {isLoading ? <Loader2 size={16} className={styles.spin} /> : <Send size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Work in Folder */}
        <div className={styles.inputMeta}>
          <button
            className={`${styles.folderBtn} ${workInFolder ? styles.folderActive : ''}`}
            onClick={() => setWorkInFolder(!workInFolder)}
          >
            <Folder size={13} />
            Work in a Folder
            <ChevronDown size={11} />
          </button>
        </div>
      </div>
    </div>
  )
}
