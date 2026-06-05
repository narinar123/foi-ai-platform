'use client'
import Sidebar from '@/components/sidebar/Sidebar'
import ChatInterface from '@/components/chat/ChatInterface'
import styles from './page.module.css'

export default function AppPage() {
  return (
    <div className={styles.appShell}>
      <Sidebar />
      <main className={styles.main}>
        <ChatInterface />
      </main>
    </div>
  )
}
