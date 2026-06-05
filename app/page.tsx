'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import WelcomeScreen from '@/components/auth/WelcomeScreen'

export default function RootPage() {
  return <WelcomeScreen />
}
