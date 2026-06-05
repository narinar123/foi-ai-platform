'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Globe, Monitor, Apple, LayoutGrid, Mail, Database,
  GitBranch, Zap, Plus, RotateCcw,
  Check, X, Search, ExternalLink
} from 'lucide-react'
import styles from './ConnectorsPage.module.css'

const CONNECTORS = [
  {
    id: 'foi-core',
    name: 'foi.ai Core',
    description: 'Grant your Agent self-awareness and autonomy: query, configure, and control everything in foi.ai.',
    icon: '✦',
    category: 'core',
    enabled: true,
    installed: true,
  },
  {
    id: 'browser',
    name: 'Browser',
    description: 'Connect to your browser for web automation and data extraction.',
    icon: '🌐',
    category: 'system',
    enabled: true,
    installed: true,
  },
  {
    id: 'computer',
    name: 'Computer Use',
    description: 'Allow AI to control mouse, keyboard, and capture screenshots.',
    icon: '🖥️',
    category: 'system',
    enabled: true,
    installed: true,
  },
  {
    id: 'macos',
    name: 'macOS Apps',
    description: 'Connect to native macOS apps like Calendar, Reminders, and Notes.',
    icon: '🍎',
    category: 'os',
    enabled: true,
    installed: true,
  },
  {
    id: 'n8n',
    name: 'n8n Automation',
    description: 'Trigger and manage n8n workflows directly from your tasks. The most powerful automation integration.',
    icon: '⚡',
    category: 'automation',
    enabled: false,
    installed: true,
    badge: 'BETA',
    config: true,
  },
  {
    id: 'microsoft365',
    name: 'Microsoft 365',
    description: 'Connect to Microsoft 365 services including Mail, Calendar, and Teams.',
    icon: '📊',
    category: 'productivity',
    enabled: false,
    installed: true,
  },
  {
    id: 'neon',
    name: 'Neon',
    description: 'Manage Neon serverless Postgres databases, branches, and projects.',
    icon: '🗄️',
    category: 'database',
    enabled: true,
    installed: true,
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Manage repositories, issues, PRs, and code reviews.',
    icon: '🐙',
    category: 'dev',
    enabled: false,
    installed: false,
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Send messages, manage channels, and automate Slack workflows.',
    icon: '💬',
    category: 'communication',
    enabled: false,
    installed: false,
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Read and write Notion pages, databases, and blocks.',
    icon: '📝',
    category: 'productivity',
    enabled: false,
    installed: false,
  },
  {
    id: 'supabase',
    name: 'Supabase',
    description: 'Query and manage your Supabase PostgreSQL databases in real-time.',
    icon: '⚡',
    category: 'database',
    enabled: false,
    installed: false,
  },
  {
    id: 'vercel',
    name: 'Vercel',
    description: 'Deploy, manage, and monitor your Vercel projects and deployments.',
    icon: '▲',
    category: 'dev',
    enabled: false,
    installed: false,
  },
]

export default function ConnectorsPage() {
  const [connectors, setConnectors] = useState(CONNECTORS)
  const [activeTab, setActiveTab] = useState<'market' | 'installed'>('installed')
  const [search, setSearch] = useState('')
  const [n8nWebhook, setN8nWebhook] = useState('')
  const [showN8nConfig, setShowN8nConfig] = useState(false)

  const toggle = (id: string) => {
    setConnectors(prev => prev.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c))
  }

  const displayed = connectors.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
    if (activeTab === 'installed') return c.installed && matchSearch
    return !c.installed && matchSearch
  })

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Connectors</h1>
          <p className={styles.subtitle}>Integrations with external apps, calendars, and services.</p>
        </div>
        <button className={styles.addBtn}>
          <Plus size={14} />
          Add
        </button>
      </div>

      {/* Hero Banner */}
      <div className={styles.heroBanner}>
        <div className={styles.heroText}>
          <h2>Unite your apps. Unleash your productivity</h2>
          <p>More efficient and enjoyable development.</p>
        </div>
        <div className={styles.heroIcons}>
          {['🔗', '⚡', '🤖', '📊', '🌐', '💬'].map((icon, i) => (
            <motion.div
              key={i}
              className={styles.heroIcon}
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.3, ease: 'easeInOut' }}
            >
              {icon}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tabs + Search */}
      <div className={styles.controls}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'market' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('market')}
          >
            Market
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'installed' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('installed')}
          >
            Installed
            <span className={styles.count}>{connectors.filter(c => c.installed).length}</span>
          </button>
        </div>
        <div className={styles.searchBox}>
          <Search size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            placeholder="Search connectors..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Custom section */}
      {activeTab === 'installed' && (
        <div className={styles.section}>
          <div className={styles.sectionLabel}>Custom</div>
          <div className={styles.customEmpty}>
            <div className={styles.customEmptyIcon}>🔌</div>
            <p className={styles.customEmptyTitle}>No custom MCP servers yet</p>
            <p className={styles.customEmptySub}>Add a custom MCP server manually or import from JSON.</p>
            <button className={styles.addCustomBtn}><Plus size={13} /> Add Custom MCP</button>
          </div>
        </div>
      )}

      {/* Connectors List */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>{activeTab === 'installed' ? 'Market' : 'Available'}</div>
        <div className={styles.connectorsList}>
          {displayed.map(connector => (
            <motion.div
              key={connector.id}
              className={styles.connectorRow}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className={styles.connectorIcon}>{connector.icon}</div>
              <div className={styles.connectorInfo}>
                <div className={styles.connectorName}>
                  {connector.name}
                  {connector.badge && (
                    <span className={styles.badge}>{connector.badge}</span>
                  )}
                </div>
                <div className={styles.connectorDesc}>{connector.description}</div>
              </div>
              <div className={styles.connectorActions}>
                {connector.id === 'n8n' && connector.enabled && (
                  <button
                    className={styles.configBtn}
                    onClick={() => setShowN8nConfig(!showN8nConfig)}
                  >
                    Configure
                  </button>
                )}
                {connector.installed ? (
                  <label className={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={connector.enabled}
                      onChange={() => toggle(connector.id)}
                    />
                    <span className={styles.toggleTrack}>
                      <span className={styles.toggleThumb} />
                    </span>
                  </label>
                ) : (
                  <button className={styles.installBtn} onClick={() => {
                    setConnectors(prev => prev.map(c => c.id === connector.id ? { ...c, installed: true, enabled: true } : c))
                  }}>
                    <Plus size={13} /> Install
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* n8n Config Panel */}
      {showN8nConfig && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.configPanel}
        >
          <div className={styles.configHeader}>
            <span>⚡ n8n Configuration</span>
            <button onClick={() => setShowN8nConfig(false)}><X size={14} /></button>
          </div>
          <div className={styles.configBody}>
            <label className={styles.configLabel}>n8n Webhook URL</label>
            <input
              type="url"
              placeholder="https://your-n8n-instance.com/webhook/..."
              value={n8nWebhook}
              onChange={e => setN8nWebhook(e.target.value)}
              className={styles.configInput}
            />
            <p className={styles.configHint}>
              Paste your n8n webhook URL to connect automation workflows to foi.ai tasks.
            </p>
            <button className={styles.saveConfigBtn}>
              <Check size={14} /> Save Configuration
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
