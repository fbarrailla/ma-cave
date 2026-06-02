'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RootPage() {
  const router = useRouter()
  useEffect(() => {
    const lang = navigator.language.startsWith('en') ? 'en' : 'fr'
    router.replace(`/${lang}`)
  }, [router])
  return null
}
