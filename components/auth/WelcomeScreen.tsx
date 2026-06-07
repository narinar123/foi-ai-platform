'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import styles from './WelcomeScreen.module.css'

export default function WelcomeScreen() {
  const router = useRouter()
  const [language, setLanguage] = useState('English')
  const [showModal, setShowModal] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    await new Promise(r => setTimeout(r, 800))
    if (!email || !password) { setError('Please fill all fields'); setLoading(false); return }
    // Store session flag
    localStorage.setItem('foi_user', JSON.stringify({ email, name: email.split('@')[0] }))
    router.push('/app')
  }

  const handleGuest = () => {
    localStorage.setItem('foi_user', JSON.stringify({ email: 'guest@foi.ai', name: 'Guest' }))
    router.push('/app')
  }

  return (
    <div className={styles.container}>
      {/* Left Panel */}
      <div className={styles.leftPanel}>
        <div className={styles.logo}>
          <Image src="/gslogo.png" alt="Guide Soft IT" width={48} height={48} className={styles.logoImg} />
        </div>

        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.brandRow}>
            <Image src="/gslogo.png" alt="GS" width={32} height={32} className={styles.inlineLogo} />
            <span className={styles.brandName}>foi.ai</span>
            <span className={styles.brandBy}>by Guide Soft IT</span>
          </div>
          <h1 className={styles.title}>Welcome to foi.ai</h1>
          <p className={styles.tagline}>AI agentic platform for everyone</p>
          <p className={styles.description}>
            Bringing agentic capabilities beyond code.<br />
            Describe what you need — foi.ai plans,<br />
            executes, and delivers.
          </p>

          <div className={styles.actions}>
            <button className={styles.loginBtn} onClick={() => { setIsLogin(true); setShowModal(true) }}>
              Login / Register
            </button>
            <div className={styles.langSelectWrap}>
              <select value={language} onChange={e => setLanguage(e.target.value)} className={styles.select}>
                <option>English</option>
                <option>Hindi</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
                <option>Japanese</option>
                <option>Chinese</option>
              </select>
              <span className={styles.selectArrow}>▾</span>
            </div>
          </div>

          <button className={styles.guestBtn} onClick={handleGuest}>
            Continue as Guest →
          </button>
          <button className={styles.networkSettings}>Network Settings</button>
        </motion.div>
      </div>

      {/* Right Panel */}
      <div className={styles.rightPanel}>
        <div className={styles.waveContainer}>
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className={styles.waveLine}
              style={{ animationDelay: `${i * 0.06}s`, left: `${(i / 50) * 100}%` }} />
          ))}
        </div>

        {/* Floating feature cards */}
        {[
          { icon: '🤖', label: 'AI Agents', top: '18%', right: '12%', delay: 0 },
          { icon: '⚡', label: 'n8n Automation', top: '38%', right: '22%', delay: 0.5 },
          { icon: '🔌', label: 'MCP Tools', top: '58%', right: '8%', delay: 1 },
          { icon: '🧠', label: 'GPT-4o / Claude', top: '28%', right: '45%', delay: 0.8 },
        ].map((card, i) => (
          <motion.div
            key={i}
            className={styles.featureCard}
            style={{ top: card.top, right: card.right }}
            animate={{ y: [0, -7, 0] }}
            transition={{ repeat: Infinity, duration: 3 + i * 0.4, ease: 'easeInOut', delay: card.delay }}
          >
            <span>{card.icon}</span> {card.label}
          </motion.div>
        ))}

        <div className={styles.rightText}>
          <p>Go from answers to action with</p>
          <p><strong>your agentic work partner</strong></p>
        </div>
      </div>

      {/* Auth Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className={styles.modal}
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <Image src="/gslogo.png" alt="GS" width={36} height={36} />
                <h2>{isLogin ? 'Sign In to foi.ai' : 'Create Account'}</h2>
              </div>

              <div className={styles.tabs}>
                <button className={`${styles.tab} ${isLogin ? styles.tabActive : ''}`} onClick={() => setIsLogin(true)}>Login</button>
                <button className={`${styles.tab} ${!isLogin ? styles.tabActive : ''}`} onClick={() => setIsLogin(false)}>Register</button>
              </div>

              <form onSubmit={handleSubmit} className={styles.form}>
                {!isLogin && (
                  <div className={styles.field}>
                    <label>Full Name</label>
                    <input type="text" placeholder="Guide Soft IT" className={styles.input} />
                  </div>
                )}
                <div className={styles.field}>
                  <label>Email</label>
                  <input type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} className={styles.input} required />
                </div>
                <div className={styles.field}>
                  <label>Password</label>
                  <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className={styles.input} required />
                </div>
                {error && <p className={styles.error}>{error}</p>}
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? 'Signing in...' : isLogin ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              <div className={styles.divider}><span>or</span></div>

              <button className={styles.guestModalBtn} onClick={handleGuest}>
                Continue without account →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
