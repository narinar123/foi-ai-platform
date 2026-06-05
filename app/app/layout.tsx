'use client'
import Sidebar from '@/components/sidebar/Sidebar'
import { usePathname } from 'next/navigation'
import styles from './content.module.css'

export default function AppContentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <main className={styles.content}>
        {children}
      </main>
    </div>
  )
}
