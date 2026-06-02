'use client'

import { useEffect } from 'react'
import { useRouter } from '@/i18n/navigation'
import { ListingForm } from '@/components/listings/ListingForm'
import { useUser } from '@/hooks/useUser'
import { useTranslations } from 'next-intl'
import { Loader2 } from 'lucide-react'

export default function NouvellAnnoncePage() {
  const user = useUser()
  const router = useRouter()
  const t = useTranslations('form')

  useEffect(() => {
    if (user === null) router.push('/connexion')
  }, [user])

  if (user === undefined) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#722f37]" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[#1a1209] mb-6">{t('title_new')}</h1>
      <ListingForm userId={user.id} />
    </div>
  )
}
