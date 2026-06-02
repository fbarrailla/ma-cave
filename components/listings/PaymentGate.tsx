'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { CheckCircle, Lock } from 'lucide-react'

const PAYPAL_URL = 'https://www.paypal.com/ncp/payment/8GKQSGSUPCC72'

interface PaymentGateProps {
  userId?: string
}

export function PaymentGate({ userId }: PaymentGateProps) {
  const t = useTranslations('payment')

  if (!userId) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <p className="text-gray-600 mb-4">{t('login_required')}</p>
        <Link href="/connexion?redirect=/annonces/nouvelle"
          className="inline-block bg-[#722f37] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#9b3d47] transition-colors">
          {t('login_cta')}
        </Link>
      </div>
    )
  }

  const features = [
    t('feature_1'),
    t('feature_2'),
    t('feature_3'),
    t('feature_4'),
  ]

  return (
    <div className="max-w-lg mx-auto">
      {/* Card */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid oklch(68% 0.09 68 / 0.25)' }}
      >
        {/* Header */}
        <div
          className="px-8 py-10 text-center"
          style={{ backgroundColor: 'oklch(19% 0.07 15)' }}
        >
          <p
            className="text-xs uppercase tracking-[0.2em] mb-4"
            style={{ color: 'oklch(68% 0.09 68)', fontFamily: 'var(--font-sans)' }}
          >
            {t('gate_title')}
          </p>
          <div className="flex items-baseline justify-center gap-1 mb-1">
            <span
              className="text-6xl font-light"
              style={{ fontFamily: 'var(--font-display)', color: 'oklch(97.5% 0.005 80)' }}
            >
              {t('price')}
            </span>
          </div>
          <p className="text-sm" style={{ color: 'oklch(60% 0.04 72)', fontFamily: 'var(--font-sans)' }}>
            {t('per_listing')}
          </p>
        </div>

        {/* Features */}
        <div
          className="px-8 py-6 space-y-3"
          style={{ backgroundColor: 'oklch(21% 0.065 15)' }}
        >
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <CheckCircle
                className="h-4 w-4 flex-shrink-0"
                style={{ color: 'oklch(68% 0.09 68)' }}
              />
              <span
                className="text-sm"
                style={{ color: 'oklch(78% 0.03 72)', fontFamily: 'var(--font-sans)' }}
              >
                {f}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className="px-8 py-6"
          style={{ backgroundColor: 'oklch(23% 0.06 15)', borderTop: '1px solid oklch(68% 0.09 68 / 0.12)' }}
        >
          <a
            href={PAYPAL_URL}
            className="block w-full py-4 text-center font-semibold text-sm uppercase tracking-[0.12em] transition-all duration-200 mb-3"
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
            {t('cta')}
          </a>

          <div className="flex items-center justify-center gap-2">
            <Lock className="h-3 w-3" style={{ color: 'oklch(50% 0.03 72)' }} />
            <p className="text-xs" style={{ color: 'oklch(50% 0.03 72)', fontFamily: 'var(--font-sans)' }}>
              {t('secure')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
