'use client'

import { useEffect } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { CheckCircle } from 'lucide-react'

const PAYMENT_SESSION_KEY = 'ma-cave-payment-ok'

export default function PaiementRetourPage() {
  const t = useTranslations('payment')

  useEffect(() => {
    sessionStorage.setItem(PAYMENT_SESSION_KEY, '1')
  }, [])

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
          style={{ backgroundColor: 'oklch(68% 0.09 68 / 0.12)', border: '1px solid oklch(68% 0.09 68 / 0.3)' }}
        >
          <CheckCircle className="h-10 w-10" style={{ color: 'oklch(68% 0.09 68)' }} />
        </div>

        {/* Decorative rule */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px flex-1" style={{ backgroundColor: 'oklch(68% 0.09 68 / 0.3)' }} />
          <span
            className="text-[10px] uppercase tracking-[0.2em]"
            style={{ color: 'oklch(68% 0.09 68)', fontFamily: 'var(--font-sans)' }}
          >
            PayPal
          </span>
          <div className="h-px flex-1" style={{ backgroundColor: 'oklch(68% 0.09 68 / 0.3)' }} />
        </div>

        <h1
          className="text-4xl mb-4"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 300,
            color: 'oklch(17% 0.04 15)',
            letterSpacing: '-0.01em',
          }}
        >
          {t('return_title')}
        </h1>

        <p
          className="text-sm leading-relaxed mb-8"
          style={{ color: 'oklch(45% 0.04 15)', fontFamily: 'var(--font-sans)' }}
        >
          {t('return_subtitle')}
        </p>

        <Link
          href="/annonces/nouvelle?paid=1"
          className="inline-block px-10 py-4 text-sm uppercase tracking-[0.14em] font-medium transition-all duration-200 mb-4"
          style={{
            backgroundColor: 'oklch(68% 0.09 68)',
            color: 'oklch(19% 0.07 15)',
            borderRadius: '2px',
            fontFamily: 'var(--font-sans)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'oklch(75% 0.09 68)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'oklch(68% 0.09 68)'
          }}
        >
          {t('return_cta')}
        </Link>

        <p
          className="text-[11px]"
          style={{ color: 'oklch(65% 0.03 72)', fontFamily: 'var(--font-sans)' }}
        >
          {t('return_note')}
        </p>
      </div>
    </div>
  )
}
