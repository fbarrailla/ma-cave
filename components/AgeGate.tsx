'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

const STORAGE_KEY = 'ma-cave-age-verified'

export function AgeGate() {
  const t = useTranslations('age_gate')
  const [visible, setVisible] = useState(false)
  const [denied, setDenied] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true)
    }
  }, [])

  const confirm = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  const deny = () => {
    setDenied(true)
  }

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
      style={{ backgroundColor: 'oklch(14% 0.05 15 / 0.97)', backdropFilter: 'blur(8px)' }}
    >
      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative w-full max-w-md text-center">
        {/* Gold rule top */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px flex-1" style={{ backgroundColor: 'oklch(68% 0.09 68 / 0.4)' }} />
          <span
            className="text-xs uppercase tracking-[0.22em]"
            style={{ color: 'oklch(68% 0.09 68)', fontFamily: 'var(--font-sans)', fontWeight: 400 }}
          >
            {t('label')}
          </span>
          <div className="h-px flex-1" style={{ backgroundColor: 'oklch(68% 0.09 68 / 0.4)' }} />
        </div>

        {/* Logo mark */}
        <div
          className="text-5xl mb-6 select-none"
          style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'oklch(68% 0.09 68)' }}
        >
          𝕄
        </div>

        {denied ? (
          <>
            <h2
              className="text-3xl mb-4"
              style={{ fontFamily: 'var(--font-display)', color: 'oklch(97.5% 0.005 80)', fontWeight: 300 }}
            >
              {t('denied_title')}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'oklch(70% 0.03 72)' }}>
              {t('denied_text')}
            </p>
          </>
        ) : (
          <>
            <h2
              className="text-4xl md:text-5xl mb-5 leading-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'oklch(97.5% 0.005 80)', fontWeight: 300, letterSpacing: '-0.01em' }}
            >
              {t('title')}
            </h2>

            <p
              className="text-sm leading-relaxed mb-10 max-w-sm mx-auto"
              style={{ color: 'oklch(68% 0.035 72)', fontFamily: 'var(--font-sans)' }}
            >
              {t('subtitle')}
            </p>

            <div className="flex flex-col gap-3 mb-8">
              <button
                onClick={confirm}
                className="w-full py-4 text-sm uppercase tracking-[0.14em] font-medium transition-all duration-200"
                style={{
                  backgroundColor: 'oklch(68% 0.09 68)',
                  color: 'oklch(19% 0.07 15)',
                  fontFamily: 'var(--font-sans)',
                  borderRadius: '2px',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'oklch(75% 0.09 68)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'oklch(68% 0.09 68)'
                }}
              >
                {t('confirm')}
              </button>

              <button
                onClick={deny}
                className="w-full py-3.5 text-sm uppercase tracking-[0.14em] font-medium transition-all duration-200"
                style={{
                  border: '1px solid oklch(68% 0.09 68 / 0.3)',
                  color: 'oklch(65% 0.04 72)',
                  fontFamily: 'var(--font-sans)',
                  borderRadius: '2px',
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'oklch(68% 0.09 68 / 0.6)'
                  ;(e.currentTarget as HTMLButtonElement).style.color = 'oklch(75% 0.04 72)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'oklch(68% 0.09 68 / 0.3)'
                  ;(e.currentTarget as HTMLButtonElement).style.color = 'oklch(65% 0.04 72)'
                }}
              >
                {t('deny')}
              </button>
            </div>

            {/* Gold rule bottom */}
            <div className="h-px mx-auto mb-6 w-12" style={{ backgroundColor: 'oklch(68% 0.09 68 / 0.4)' }} />

            <p
              className="text-[10px] leading-relaxed mx-auto max-w-xs"
              style={{ color: 'oklch(48% 0.03 72)', fontFamily: 'var(--font-sans)' }}
            >
              {t('legal')}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
