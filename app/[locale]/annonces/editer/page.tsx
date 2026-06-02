'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/client'
import { ListingForm } from '@/components/listings/ListingForm'
import { useUser } from '@/hooks/useUser'
import { useTranslations } from 'next-intl'
import { Loader2 } from 'lucide-react'
import type { Listing } from '@/lib/supabase/types'

function EditListingContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const user = useUser()
  const t = useTranslations('form')
  const id = searchParams.get('id')
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) { router.replace('/annonces'); return }
    if (user === undefined) return
    if (user === null) { router.push('/connexion'); return }

    createClient()
      .from('listings').select('*').eq('id', id).single()
      .then(({ data }) => {
        if (!data || data.seller_id !== user.id) { router.replace('/annonces'); return }
        setListing(data)
        setLoading(false)
      })
  }, [user, id])

  if (loading || user === undefined) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#722f37]" />
      </div>
    )
  }

  if (!listing || !user) return null

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[#1a1209] mb-6">{t('title_edit')}</h1>
      <ListingForm userId={user.id} listing={listing} />
    </div>
  )
}

export default function EditerAnnoncePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-64"><Loader2 className="h-8 w-8 animate-spin text-[#722f37]" /></div>}>
      <EditListingContent />
    </Suspense>
  )
}
