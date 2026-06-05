'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import styles from './WelcomeScreen.module.css'

export default function WelcomeScreen() {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [language, setLanguage] = useState('English')

  const handleEnter = () => {
    router.push('/app')
  }

  return (
    <div className={styles.container}>
      {/* Left Panel */}
      <div className={styles.leftPanel}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <span>✦</span>
          </div>
        </div>

        <div className={styles.content}>
          <h1 className={styles.title}>Welcome to foi.ai</h1>
          <p className={styles.tagline}>AI agentic platform for everyone</p>
          <p className={styles.description}>
            Bringing agentic capabilities beyond code.<br />
            Describe what you need — foi.ai plans,<br />
            executes, and delivers.
          </p>

          <div className={styles.actions}>
            <button
              className={styles.loginBtn}
              onClick={handleEnter}
            >
              Get Started
            </button>
            <div className={styles.langSelect}>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={styles.select}
              >
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

          <button className={styles.networkSettings}>
            Network Settings
          </button>
        </div>
      </div>

      {/* Right Panel — Animated */}
      <div className={styles.rightPanel}>
        <div className={styles.waveContainer}>
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className={styles.waveLine}
              style={{
                animationDelay: `${i * 0.05}s`,
                left: `${(i / 60) * 100}%`,
              }}
            />
          ))}
        </div>
        <div className={styles.rightText}>
          <p>Go from answers to action with</p>
          <p><strong>your agentic work partner</strong></p>
        </div>

        {/* Floating Feature Cards */}
        <motion.div
          className={styles.featureCard}
          style={{ top: '15%', right: '8%' }}
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        >
          <span>🤖</span> AI Agents
        </motion.div>
        <motion.div
          className={styles.featureCard}
          style={{ top: '38%', right: '20%' }}
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 0.5 }}
        >
          <span>⚡</span> n8n Automation
        </motion.div>
        <motion.div
          className={styles.featureCard}
          style={{ top: '60%', right: '6%' }}
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 1 }}
        >
          <span>🔌</span> MCP Tools
        </motion.div>
      </div>
    </div>
  )
}
