'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Puzzle, Star, Download, Check } from 'lucide-react'
import styles from './plugins.module.css'

const PLUGINS = [
  { id: 'web-researcher', name: 'Web Researcher', description: 'Automatically research topics on the web and compile structured reports.', icon: '🔍', installed: true, rating: 4.8, downloads: 12400 },
  { id: 'code-assistant', name: 'Code Assistant', description: 'Generate, debug, and explain code across 50+ programming languages.', icon: '💻', installed: true, rating: 4.9, downloads: 28900 },
  { id: 'file-organizer', name: 'File Organizer', description: 'Intelligently organize, rename, and categorize files using AI.', icon: '📁', installed: true, rating: 4.6, downloads: 8200 },
  { id: 'email-composer', name: 'Email Composer', description: 'Draft professional emails, follow-ups, and newsletters with AI assistance.', icon: '📧', installed: false, rating: 4.5, downloads: 6100 },
  { id: 'data-analyzer', name: 'Data Analyzer', description: 'Analyze CSV, JSON and Excel files with natural language queries.', icon: '📊', installed: false, rating: 4.7, downloads: 9800 },
  { id: 'meeting-notes', name: 'Meeting Notes', description: 'Transcribe and summarize meetings, extract action items automatically.', icon: '🎙️', installed: false, rating: 4.4, downloads: 5400 },
  { id: 'social-manager', name: 'Social Media Manager', description: 'Schedule, write, and analyze social media posts across all platforms.', icon: '📱', installed: false, rating: 4.3, downloads: 7600 },
  { id: 'n8n-builder', name: 'n8n Workflow Builder', description: 'Build and deploy n8n automation workflows using natural language.', icon: '⚡', installed: true, rating: 4.9, downloads: 15200 },
]

export default function PluginsPage() {
  const [plugins, setPlugins] = useState(PLUGINS)
  const [activeTab, setActiveTab] = useState<'all' | 'installed'>('all')

  const toggle = (id: string) => {
    setPlugins(prev => prev.map(p => p.id === id ? { ...p, installed: !p.installed } : p))
  }

  const displayed = activeTab === 'installed' ? plugins.filter(p => p.installed) : plugins

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <Puzzle size={22} style={{ color: 'var(--brand-primary)' }} />
          <h1 className={styles.title}>Plugins</h1>
        </div>
        <p className={styles.subtitle}>Extend foi.ai with powerful capabilities</p>
      </div>

      <div className={styles.tabs}>
        {(['all', 'installed'] as const).map(tab => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'all' ? 'All Plugins' : `Installed (${plugins.filter(p => p.installed).length})`}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {displayed.map((plugin, i) => (
          <motion.div
            key={plugin.id}
            className={styles.card}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>{plugin.icon}</div>
              <div>
                <div className={styles.cardName}>{plugin.name}</div>
                <div className={styles.cardMeta}>
                  <Star size={11} fill="currentColor" />
                  {plugin.rating} · {plugin.downloads.toLocaleString()} installs
                </div>
              </div>
            </div>
            <p className={styles.cardDesc}>{plugin.description}</p>
            <button
              className={`${styles.installBtn} ${plugin.installed ? styles.installedBtn : ''}`}
              onClick={() => toggle(plugin.id)}
            >
              {plugin.installed ? (
                <><Check size={13} /> Installed</>
              ) : (
                <><Download size={13} /> Install</>
              )}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
