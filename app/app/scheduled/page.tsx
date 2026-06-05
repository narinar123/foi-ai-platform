'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, Plus, Play, Pause, Trash2, Calendar, Zap } from 'lucide-react'
import styles from './scheduled.module.css'

const SCHEDULED_TASKS = [
  { id: '1', name: 'Daily News Digest', schedule: 'Every day at 8:00 AM', lastRun: '2 hours ago', status: 'active', skill: 'Web Research' },
  { id: '2', name: 'Weekly Report Generation', schedule: 'Every Monday at 9:00 AM', lastRun: '5 days ago', status: 'active', skill: 'Data Analysis' },
  { id: '3', name: 'n8n Health Check', schedule: 'Every hour', lastRun: '58 minutes ago', status: 'active', skill: 'n8n Trigger' },
  { id: '4', name: 'Social Media Post', schedule: 'Every weekday at 12:00 PM', lastRun: '3 days ago', status: 'paused', skill: 'Social Manager' },
]

export default function ScheduledPage() {
  const [tasks, setTasks] = useState(SCHEDULED_TASKS)

  const toggle = (id: string) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, status: t.status === 'active' ? 'paused' : 'active' } : t
    ))
  }

  const remove = (id: string) => setTasks(prev => prev.filter(t => t.id !== id))

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <Clock size={22} style={{ color: 'var(--brand-primary)' }} />
          <h1 className={styles.title}>Scheduled Tasks</h1>
        </div>
        <p className={styles.subtitle}>Automate recurring tasks on a schedule</p>
        <button className={styles.addBtn}><Plus size={14} /> New Schedule</button>
      </div>

      {tasks.length === 0 ? (
        <div className={styles.empty}>
          <Calendar size={48} style={{ opacity: 0.2, color: 'var(--text-muted)' }} />
          <p>No scheduled tasks yet</p>
          <span>Create a scheduled task to automate recurring work</span>
        </div>
      ) : (
        <div className={styles.list}>
          {tasks.map((task, i) => (
            <motion.div
              key={task.id}
              className={`${styles.taskRow} ${task.status === 'paused' ? styles.paused : ''}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <div className={`${styles.statusDot} ${task.status === 'active' ? styles.dotActive : styles.dotPaused}`} />
              <div className={styles.taskInfo}>
                <div className={styles.taskName}>{task.name}</div>
                <div className={styles.taskMeta}>
                  <Clock size={11} /> {task.schedule}
                  <span className={styles.dot}>·</span>
                  <Zap size={11} /> {task.skill}
                  <span className={styles.dot}>·</span>
                  Last run: {task.lastRun}
                </div>
              </div>
              <div className={styles.taskActions}>
                <button className={styles.actionBtn} onClick={() => toggle(task.id)} title={task.status === 'active' ? 'Pause' : 'Resume'}>
                  {task.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <button className={styles.actionBtn} onClick={() => remove(task.id)} title="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
