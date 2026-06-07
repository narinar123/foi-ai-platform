'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import {
  Plus, Search, LayoutGrid, Settings, Clock, MessageSquare,
  Puzzle, Zap, Link2, ChevronDown, ChevronRight, Hash,
  CheckSquare, Bell, LogOut, Sparkles
} from 'lucide-react'
import styles from './Sidebar.module.css'

interface Task { id: string; title: string; time: string; status: 'running' | 'done' | 'pending' }
interface User { email: string; name: string }

const MOCK_TASKS: Task[] = [
  { id: '1', title: 'I WANT U T ORGANISE ALL MY SOCIAL M...', time: '1h ago', status: 'done' },
  { id: '2', title: 'organise entire my system files from mac d...', time: '2h ago', status: 'done' },
  { id: '3', title: 'Organise all files and folders and images...', time: '4h ago', status: 'done' },
  { id: '4', title: 'Set up n8n automation workflows', time: 'Yesterday', status: 'done' },
  { id: '5', title: 'contine with my request', time: '2d ago', status: 'pending' },
]

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [extensionsOpen, setExtensionsOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<'tasks' | 'channels'>('tasks')
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [notifications, setNotifications] = useState(3)

  useEffect(() => {
    const stored = localStorage.getItem('foi_user')
    if (stored) setUser(JSON.parse(stored))
    else setUser({ email: 'guest@foi.ai', name: 'Guest' })
  }, [])

  const nav = (path: string) => router.push(path)
  const isActive = (path: string) => pathname === path

  const handleLogout = () => {
    localStorage.removeItem('foi_user')
    router.push('/')
  }

  const filtered = MOCK_TASKS.filter(t =>
    !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <aside className={styles.sidebar}>
      {/* Header */}
      <div className={styles.header}>
        <button className={`${styles.newTaskBtn}`} onClick={() => nav('/app')}>
          <Plus size={15} />
          <span>New Task</span>
        </button>
        <button className={styles.iconBtn} onClick={() => setSearchOpen(!searchOpen)} title="Search">
          <Search size={14} />
        </button>
        <button className={styles.iconBtn} title="View all">
          <LayoutGrid size={14} />
        </button>
      </div>

      {/* Search */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className={styles.searchWrap}>
            <Search size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <input autoFocus placeholder="Search tasks..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className={styles.searchInput} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav */}
      <nav className={styles.nav}>
        {/* Extensions */}
        <div>
          <button className={`${styles.navItem} ${extensionsOpen ? styles.navOpen : ''}`} onClick={() => setExtensionsOpen(!extensionsOpen)}>
            <Puzzle size={14} />
            <span>Extensions</span>
            <span className={styles.chevron}>{extensionsOpen ? <ChevronDown size={11} /> : <ChevronRight size={11} />}</span>
          </button>
          <AnimatePresence>
            {extensionsOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className={styles.subNav}>
                <button className={`${styles.subNavItem} ${isActive('/app/extensions/plugins') ? styles.active : ''}`} onClick={() => nav('/app/extensions/plugins')}>
                  <Puzzle size={12} /> Plugins
                </button>
                <button className={`${styles.subNavItem} ${isActive('/app/extensions/skills') ? styles.active : ''}`} onClick={() => nav('/app/extensions/skills')}>
                  <Zap size={12} /> Skills
                </button>
                <button className={`${styles.subNavItem} ${isActive('/app/extensions/connectors') ? styles.active : ''}`} onClick={() => nav('/app/extensions/connectors')}>
                  <Link2 size={12} /> Connectors
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button className={`${styles.navItem} ${isActive('/app/scheduled') ? styles.active : ''}`} onClick={() => nav('/app/scheduled')}>
          <Clock size={14} /><span>Scheduled Tasks</span>
        </button>

        <button className={`${styles.navItem} ${isActive('/app/im-channel') ? styles.active : ''}`} onClick={() => nav('/app/im-channel')}>
          <MessageSquare size={14} /><span>IM Channel</span>
          {notifications > 0 && <span className={styles.notifBadge}>{notifications}</span>}
        </button>

        <button className={`${styles.navItem} ${isActive('/app/playground') ? styles.active : ''}`} onClick={() => nav('/app/playground')}>
          <Sparkles size={14} /><span>Arena Playground</span>
        </button>
      </nav>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${activeTab === 'tasks' ? styles.tabActive : ''}`} onClick={() => setActiveTab('tasks')}>
          <CheckSquare size={12} /> Tasks
        </button>
        <button className={`${styles.tab} ${activeTab === 'channels' ? styles.tabActive : ''}`} onClick={() => setActiveTab('channels')}>
          <MessageSquare size={12} /> Channels
        </button>
      </div>

      {/* Task / Channel list */}
      <div className={styles.taskList}>
        {activeTab === 'tasks' ? (
          <>
            <div className={styles.sectionLabel}>Drafts</div>
            <button className={`${styles.taskItem} ${isActive('/app') ? styles.taskItemActive : ''}`} onClick={() => nav('/app')}>
              <Hash size={12} />
              <span className={styles.taskTitle}>New conversation</span>
            </button>
            <div className={styles.sectionLabel}>Tasks</div>
            {filtered.map(task => (
              <button key={task.id} className={styles.taskItem} onClick={() => nav(`/app/tasks/${task.id}`)} title={task.title}>
                <span className={`${styles.taskDot} ${task.status === 'done' ? styles.dotDone : styles.dotPending}`} />
                <span className={styles.taskTitle}>{task.title}</span>
              </button>
            ))}
          </>
        ) : (
          <div className={styles.emptyState}>
            <MessageSquare size={24} style={{ opacity: 0.2 }} />
            <span>No channels yet</span>
            <button className={styles.createChannelBtn} onClick={() => nav('/app/im-channel')}>+ Create Channel</button>
          </div>
        )}
      </div>

      {/* User bar */}
      <div className={styles.userBar}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            <Image src="/gslogo.png" alt="GS" width={28} height={28} style={{ borderRadius: 7 }} />
          </div>
          <div className={styles.userMeta}>
            <span className={styles.userName}>{user?.name || 'Guide Soft IT'}</span>
            <span className={styles.userPlan}>Free Plan</span>
          </div>
        </div>
        <div className={styles.userActions}>
          <button className={styles.iconBtn} onClick={() => nav('/app/settings/preferences')} title="Settings">
            <Settings size={14} />
          </button>
          <button className={styles.iconBtn} onClick={handleLogout} title="Logout">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}
