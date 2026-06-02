'use client'

import { Suspense } from 'react'
import { Link } from '@/i18n/navigation'
import { Wine } from 'lucide-react'
import { ConnexionClient } from './ConnexionClient'
import { useTranslations } from 'next-intl'

export default function ConnexionPage() {
  const t = useTranslations('auth')
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-[#4a1d24]">
            <Wine className="h-7 w-7 text-[#c9a84c]" />
            <span className="text-[#c9a84c]">Ma</span> Cave
          </Link>
          <h1 className="text-xl font-semibold text-gray-800 mt-4">{t('welcome')}</h1>
        </div>
        <Suspense fallback={<div className="bg-white rounded-2xl border border-[#f0e8d8] p-6 h-64 animate-pulse" />}>
          <ConnexionClient />
        </Suspense>
      </div>
    </div>
  )
}
