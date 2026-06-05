'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Send, Plus, Hash, Users, Search } from 'lucide-react'
import styles from './im.module.css'

const CHANNELS = [
  { id: 'general', name: 'general', unread: 0 },
  { id: 'agents', name: 'agents', unread: 3 },
  { id: 'n8n-alerts', name: 'n8n-alerts', unread: 1 },
  { id: 'dev', name: 'development', unread: 0 },
]

const MESSAGES = [
  { id: '1', user: 'System', content: '✅ n8n workflow "Daily Digest" completed successfully', time: '9:00 AM', type: 'system' },
  { id: '2', user: 'Agent', content: 'I\'ve finished researching the latest AI papers. Summary ready in the main task.', time: '9:05 AM', type: 'agent' },
  { id: '3', user: 'You', content: 'Great! Can you also check for n8n updates?', time: '9:07 AM', type: 'user' },
  { id: '4', user: 'Agent', content: 'On it. Checking n8n.io for latest releases... 🔍', time: '9:07 AM', type: 'agent' },
]

export default function IMChannelPage() {
  const [messages, setMessages] = useState(MESSAGES)
  const [activeChannel, setActiveChannel] = useState('general')
  const [input, setInput] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = () => {
    if (!input.trim()) return
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      user: 'You',
      content: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'user',
    }])
    setInput('')
  }

  return (
    <div className={styles.page}>
      {/* Channel List */}
      <div className={styles.channelList}>
        <div className={styles.channelHeader}>
          <span>IM Channel</span>
          <button className={styles.iconBtn}><Plus size={14} /></button>
        </div>
        <div className={styles.searchBox}>
          <Search size={12} style={{ color: 'var(--text-muted)' }} />
          <input placeholder="Search channels..." className={styles.searchInput} />
        </div>
        <div className={styles.channels}>
          <div className={styles.sectionLabel}>Channels</div>
          {CHANNELS.map(c => (
            <button
              key={c.id}
              className={`${styles.channelItem} ${activeChannel === c.id ? styles.channelActive : ''}`}
              onClick={() => setActiveChannel(c.id)}
            >
              <Hash size={13} />
              <span>{c.name}</span>
              {c.unread > 0 && <span className={styles.unreadBadge}>{c.unread}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className={styles.chat}>
        <div className={styles.chatHeader}>
          <Hash size={15} />
          <span className={styles.chatTitle}>{activeChannel}</span>
          <div className={styles.chatMeta}>
            <Users size={13} /> 3 members
          </div>
        </div>

        <div className={styles.messages}>
          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${styles.msg} ${msg.type === 'user' ? styles.msgUser : ''} ${msg.type === 'system' ? styles.msgSystem : ''}`}
              >
                {msg.type !== 'system' && (
                  <div className={`${styles.avatar} ${msg.type === 'agent' ? styles.agentAvatar : styles.userAvatar}`}>
                    {msg.user[0]}
                  </div>
                )}
                <div className={styles.msgContent}>
                  {msg.type !== 'system' && (
                    <div className={styles.msgHeader}>
                      <span className={styles.msgUser}>{msg.user}</span>
                      <span className={styles.msgTime}>{msg.time}</span>
                    </div>
                  )}
                  <div className={styles.msgText}>{msg.content}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={endRef} />
        </div>

        <div className={styles.inputArea}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder={`Message #${activeChannel}`}
            className={styles.input}
          />
          <button className={styles.sendBtn} onClick={send}>
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}
