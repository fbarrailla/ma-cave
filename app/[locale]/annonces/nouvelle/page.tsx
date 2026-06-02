'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ListingForm } from '@/components/listings/ListingForm'
import { PaymentGate } from '@/components/listings/PaymentGate'
import { useUser } from '@/hooks/useUser'
import { useTranslations } from 'next-intl'
import { Loader2 } from 'lucide-react'

const PAYMENT_SESSION_KEY = 'ma-cave-payment-ok'

function NouvelleAnnonceContent() {
  const user = useUser()
  const searchParams = useSearchParams()
  const t = useTranslations('form')
  const [paid, setPaid] = useState(false)

  useEffect(() => {
    // PayPal redirects back with ?paid=1 — store in sessionStorage for the current session
    if (searchParams.get('paid') === '1') {
      sessionStorage.setItem(PAYMENT_SESSION_KEY, '1')
      setPaid(true)
    } else if (sessionStorage.getItem(PAYMENT_SESSION_KEY) === '1') {
      setPaid(true)
    }
  }, [searchParams])

  if (user === undefined) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#722f37]" />
      </div>
    )
  }

  if (paid && user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#1a1209] mb-6">{t('title_new')}</h1>
        <ListingForm userId={user.id} onSuccess={() => sessionStorage.removeItem(PAYMENT_SESSION_KEY)} />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <PaymentGate userId={user?.id} />
    </div>
  )
}

export default function NouvellAnnoncePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-64"><Loader2 className="h-8 w-8 animate-spin text-[#722f37]" /></div>}>
      <NouvelleAnnonceContent />
    </Suspense>
  )
}
