'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import styles from './PreferencesPage.module.css'

interface Setting {
  key: string
  label: string
  description: string
  type: 'select' | 'toggle'
  options?: string[]
  value: string | boolean
}

export default function PreferencesPage() {
  const [settings, setSettings] = useState<Setting[]>([
    { key: 'language', label: 'Language', description: 'Select interface language', type: 'select', options: ['English', 'Hindi', 'Spanish', 'French', 'German', 'Japanese', 'Chinese'], value: 'English' },
    { key: 'theme', label: 'Theme brightness', description: 'Light, dark, or follow your system setting.', type: 'select', options: ['Light', 'Dark', 'System'], value: 'Dark' },
    { key: 'interface', label: 'Interface style', description: 'Default, glass, classic, or parchment appearance.', type: 'select', options: ['Default', 'Glass', 'Classic', 'Parchment'], value: 'Glass' },
    { key: 'typeface', label: 'Chat typeface', description: 'Sans or serif for conversation content.', type: 'select', options: ['Sans-serif', 'Serif', 'Monospace'], value: 'Sans-serif' },
    { key: 'textSize', label: 'Conversation text size', description: 'Adjusts message text size in chat.', type: 'select', options: ['Small', 'Medium', 'Large'], value: 'Small' },
    { key: 'panelPosition', label: 'Task Panel Position', description: 'Where the task panel is displayed in the workspace', type: 'select', options: ['Docked on the right', 'Docked on the left', 'Floating', 'Hidden'], value: 'Docked on the right' },
    { key: 'previewMode', label: 'Preview Mode', description: 'How to preview generated files (images, markdown)', type: 'select', options: ['New window', 'Inline', 'Side panel'], value: 'New window' },
    { key: 'promptSuggestions', label: 'Prompt Suggestions', description: 'When enabled, AI will generate follow-up suggestions after completing a response. Requires starting a new conversation to take effect.', type: 'toggle', value: true },
    { key: 'expandToolCalls', label: 'Expand tool calls by default', description: "When off, tool calls in chat start collapsed. When on, newly shown tool blocks open expanded; you can still collapse them manually.", type: 'toggle', value: true },
    { key: 'showToolSteps', label: 'Show tool execution steps in IM channels', description: "When on, IM channel replies include each tool execution step (search results, file reads, code execution, etc.). When off, only the final reply is shown for cleaner messages.", type: 'toggle', value: true },
    { key: 'streaming', label: 'Stream responses', description: 'Show AI responses as they are generated in real-time.', type: 'toggle', value: true },
    { key: 'n8nAutoTrigger', label: 'Auto-trigger n8n workflows', description: 'Automatically run n8n automation when relevant tasks are detected.', type: 'toggle', value: false },
  ])

  const update = (key: string, value: string | boolean) => {
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s))
  }

  const toggleSettings = settings.filter(s => s.type === 'toggle')
  const selectSettings = settings.filter(s => s.type === 'select')

  return (
    <div className={styles.page}>
      {/* Back */}
      <div className={styles.backBar}>
        <button className={styles.backBtn} onClick={() => window.history.back()}>
          ← Back to app
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.sidebar}>
          <div className={styles.sideSection}>
            <div className={styles.sideSectionLabel}>General</div>
            {['Preferences', 'Profile', 'System', 'Voice Input', 'App Snapshot', 'Keyboard', 'App update'].map(item => (
              <button
                key={item}
                className={`${styles.sideItem} ${item === 'Preferences' ? styles.sideItemActive : ''}`}
              >
                {item}
                {item === 'App Snapshot' && <span className={styles.betaBadge}>Beta</span>}
              </button>
            ))}
          </div>
          <div className={styles.sideSection}>
            <div className={styles.sideSectionLabel}>Extensions & Integrations</div>
            <button className={styles.sideItem}>
              Desk <span className={styles.betaBadge}>Beta</span>
            </button>
          </div>
          <div className={styles.sideSection}>
            <div className={styles.sideSectionLabel}>Advanced</div>
            {['Secure Workspace', 'Experimental'].map(item => (
              <button key={item} className={styles.sideItem}>{item}</button>
            ))}
          </div>
        </div>

        <div className={styles.main}>
          <h1 className={styles.title}>Preferences</h1>
          <p className={styles.subtitle}>Language, theme, typography, and panel layout preferences.</p>

          <div className={styles.settingsList}>
            {/* Select settings */}
            {selectSettings.map(s => (
              <motion.div
                key={s.key}
                className={styles.settingRow}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className={styles.settingInfo}>
                  <div className={styles.settingLabel}>{s.label}</div>
                  <div className={styles.settingDesc}>{s.description}</div>
                </div>
                <div className={styles.settingControl}>
                  <select
                    value={s.value as string}
                    onChange={e => update(s.key, e.target.value)}
                    className={styles.select}
                  >
                    {s.options?.map(o => <option key={o}>{o}</option>)}
                  </select>
                  <span className={styles.selectArrow}>▾</span>
                </div>
              </motion.div>
            ))}

            {/* Divider */}
            <div className={styles.divider} />

            {/* Toggle settings */}
            {toggleSettings.map(s => (
              <motion.div
                key={s.key}
                className={styles.settingRow}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className={styles.settingInfo}>
                  <div className={styles.settingLabel}>{s.label}</div>
                  <div className={styles.settingDesc}>{s.description}</div>
                </div>
                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={s.value as boolean}
                    onChange={e => update(s.key, e.target.checked)}
                  />
                  <span className={styles.toggleTrack}>
                    <span className={styles.toggleThumb} />
                  </span>
                </label>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
