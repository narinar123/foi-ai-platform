'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Check, Lock } from 'lucide-react'
import styles from './skills.module.css'

const SKILLS = [
  { id: 'web-search', name: 'Web Search', desc: 'Real-time web research using search engines and content extraction.', icon: '🔍', category: 'Research', active: true, pro: false },
  { id: 'code-gen', name: 'Code Generation', desc: 'Write, refactor, and debug code in any programming language.', icon: '💻', category: 'Development', active: true, pro: false },
  { id: 'n8n-trigger', name: 'n8n Workflow Trigger', desc: 'Trigger and manage n8n automation workflows from tasks.', icon: '⚡', category: 'Automation', active: true, pro: false },
  { id: 'file-ops', name: 'File Operations', desc: 'Read, write, organize, and manage files and directories.', icon: '📁', category: 'System', active: true, pro: false },
  { id: 'data-analysis', name: 'Data Analysis', desc: 'Analyze structured data with pandas-style operations.', icon: '📊', category: 'Analytics', active: false, pro: false },
  { id: 'email-send', name: 'Email Sending', desc: 'Compose and send emails via SMTP or email service providers.', icon: '📧', category: 'Communication', active: false, pro: false },
  { id: 'image-gen', name: 'Image Generation', desc: 'Generate images using DALL-E, Stable Diffusion, or Midjourney.', icon: '🎨', category: 'Creative', active: false, pro: true },
  { id: 'voice-synth', name: 'Voice Synthesis', desc: 'Convert text to natural-sounding speech using ElevenLabs.', icon: '🎙️', category: 'Audio', active: false, pro: true },
  { id: 'browser-auto', name: 'Browser Automation', desc: 'Control browsers with Playwright for web scraping and testing.', icon: '🌐', category: 'Automation', active: false, pro: false },
  { id: 'mcp-client', name: 'MCP Client', desc: 'Connect to any MCP-compatible server and invoke its tools.', icon: '🔌', category: 'Integration', active: true, pro: false },
  { id: 'supabase', name: 'Supabase Query', desc: 'Query and mutate your Supabase database in real-time.', icon: '⚡', category: 'Database', active: false, pro: false },
  { id: 'github-ops', name: 'GitHub Operations', desc: 'Create issues, PRs, commits, and manage repositories.', icon: '🐙', category: 'Development', active: false, pro: false },
]

const CATEGORIES = ['All', ...Array.from(new Set(SKILLS.map(s => s.category)))]

export default function SkillsPage() {
  const [skills, setSkills] = useState(SKILLS)
  const [activeCategory, setActiveCategory] = useState('All')

  const toggle = (id: string) => {
    setSkills(prev => prev.map(s => s.id === id && !s.pro ? { ...s, active: !s.active } : s))
  }

  const filtered = skills.filter(s =>
    activeCategory === 'All' || s.category === activeCategory
  )

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <Zap size={22} style={{ color: 'var(--brand-primary)' }} />
          <h1 className={styles.title}>Skills</h1>
        </div>
        <p className={styles.subtitle}>Agentic capabilities that foi.ai can use to complete your tasks</p>
      </div>

      <div className={styles.categories}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`${styles.catBtn} ${activeCategory === cat ? styles.catActive : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {filtered.map((skill, i) => (
          <motion.div
            key={skill.id}
            className={`${styles.card} ${skill.active ? styles.cardActive : ''}`}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04 }}
          >
            <div className={styles.cardTop}>
              <div className={styles.icon}>{skill.icon}</div>
              <div className={styles.badges}>
                <span className={styles.catTag}>{skill.category}</span>
                {skill.pro && <span className={styles.proBadge}>PRO</span>}
              </div>
            </div>
            <div className={styles.cardName}>{skill.name}</div>
            <div className={styles.cardDesc}>{skill.desc}</div>
            <div className={styles.cardFoot}>
              {skill.pro ? (
                <button className={styles.proBtn}><Lock size={12} /> Upgrade</button>
              ) : (
                <label className={styles.toggle}>
                  <input type="checkbox" checked={skill.active} onChange={() => toggle(skill.id)} />
                  <span className={styles.toggleTrack}><span className={styles.toggleThumb} /></span>
                  <span className={styles.toggleLabel}>{skill.active ? 'Active' : 'Inactive'}</span>
                </label>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
