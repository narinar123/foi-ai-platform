'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, LayoutGrid, Settings, Clock, MessageSquare,
  Puzzle, Zap, Link2, ChevronDown, ChevronRight, Hash,
  CheckSquare, User, Bell, Command
} from 'lucide-react'
import styles from './Sidebar.module.css'

const MOCK_TASKS = [
  { id: '1', title: 'Organise all my social media content', time: '2h ago' },
  { id: '2', title: 'Set up n8n automation for emails', time: '4h ago' },
  { id: '3', title: 'Build Next.js dashboard with AI', time: 'Yesterday' },
  { id: '4', title: 'Configure MCP connectors', time: '2d ago' },
  { id: '5', title: 'Research best LLM for coding', time: '3d ago' },
]

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [extensionsOpen, setExtensionsOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<'tasks' | 'channels'>('tasks')
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const nav = (path: string) => router.push(path)
  const isActive = (path: string) => pathname === path

  return (
    <aside className={styles.sidebar}>
      {/* Header */}
      <div className={styles.header}>
        <button
          className={`${styles.newTaskBtn} ${styles.sidebarItem}`}
          onClick={() => nav('/app')}
        >
          <Plus size={16} />
          <span>New Task</span>
        </button>
        <button className={styles.iconBtn} onClick={() => setSearchOpen(!searchOpen)}>
          <Search size={15} />
        </button>
        <button className={styles.iconBtn}>
          <LayoutGrid size={15} />
        </button>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={styles.searchWrap}
          >
            <Search size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <input
              autoFocus
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav Items */}
      <nav className={styles.nav}>
        {/* Extensions */}
        <div>
          <button
            className={`${styles.sidebarItem} ${styles.navItem}`}
            onClick={() => setExtensionsOpen(!extensionsOpen)}
          >
            <Puzzle size={15} />
            <span>Extensions</span>
            <span className={styles.chevron}>
              {extensionsOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </span>
          </button>
          <AnimatePresence>
            {extensionsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={styles.subNav}
              >
                <button
                  className={`${styles.subNavItem} ${isActive('/app/extensions/plugins') ? styles.active : ''}`}
                  onClick={() => nav('/app/extensions/plugins')}
                >
                  <Puzzle size={13} />
                  Plugins
                </button>
                <button
                  className={`${styles.subNavItem} ${isActive('/app/extensions/skills') ? styles.active : ''}`}
                  onClick={() => nav('/app/extensions/skills')}
                >
                  <Zap size={13} />
                  Skills
                </button>
                <button
                  className={`${styles.subNavItem} ${isActive('/app/extensions/connectors') ? styles.active : ''}`}
                  onClick={() => nav('/app/extensions/connectors')}
                >
                  <Link2 size={13} />
                  Connectors
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          className={`${styles.sidebarItem} ${styles.navItem} ${isActive('/app/scheduled') ? styles.active : ''}`}
          onClick={() => nav('/app/scheduled')}
        >
          <Clock size={15} />
          <span>Scheduled Tasks</span>
        </button>

        <button
          className={`${styles.sidebarItem} ${styles.navItem} ${isActive('/app/im-channel') ? styles.active : ''}`}
          onClick={() => nav('/app/im-channel')}
        >
          <MessageSquare size={15} />
          <span>IM Channel</span>
        </button>
      </nav>

      {/* Tab switcher */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'tasks' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          <CheckSquare size={13} />
          Tasks
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'channels' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('channels')}
        >
          <MessageSquare size={13} />
          Channels
        </button>
      </div>

      {/* Content */}
      <div className={styles.taskList}>
        {activeTab === 'tasks' ? (
          <>
            {/* Drafts */}
            <div className={styles.sectionLabel}>Drafts</div>
            <button className={`${styles.taskItem} ${isActive('/app') ? styles.active : ''}`} onClick={() => nav('/app')}>
              <Hash size={13} />
            </button>

            {/* Tasks */}
            <div className={styles.sectionLabel}>Tasks</div>
            {MOCK_TASKS.filter(t =>
              searchQuery ? t.title.toLowerCase().includes(searchQuery.toLowerCase()) : true
            ).map(task => (
              <button
                key={task.id}
                className={styles.taskItem}
                onClick={() => nav(`/app/tasks/${task.id}`)}
                title={task.title}
              >
                <span className={styles.taskTitle}>{task.title}</span>
              </button>
            ))}
          </>
        ) : (
          <div className={styles.emptyState}>
            <MessageSquare size={28} style={{ opacity: 0.3 }} />
            <span>No channels yet</span>
          </div>
        )}
      </div>

      {/* Bottom User */}
      <div className={styles.userBar}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            <span>G</span>
          </div>
          <div className={styles.userMeta}>
            <span className={styles.userName}>Guide Soft IT</span>
            <span className={styles.userPlan}>Free Plan</span>
          </div>
        </div>
        <button
          className={styles.iconBtn}
          onClick={() => nav('/app/settings/preferences')}
          title="Settings"
        >
          <Settings size={15} />
        </button>
      </div>
    </aside>
  )
}
