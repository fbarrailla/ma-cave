'use client'

import { Link } from '@/i18n/navigation'
import { Wine } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function Footer() {
  const t = useTranslations('footer')
  return (
    <footer className="bg-[#4a1d24] text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Wine className="h-5 w-5 text-[#c9a84c]" />
              <span className="font-bold text-lg"><span className="text-[#c9a84c]">Ma</span> Cave</span>
            </div>
            <p className="text-sm text-white/60">{t('tagline')}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-[#c9a84c]">{t('navigation')}</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/annonces" className="hover:text-white transition-colors">{t('explore')}</Link></li>
              <li><Link href="/annonces/nouvelle" className="hover:text-white transition-colors">{t('sell')}</Link></li>
              <li><Link href="/connexion" className="hover:text-white transition-colors">{t('account')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-[#c9a84c]">{t('info')}</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/mentions-legales" className="hover:text-white transition-colors">{t('legal')}</Link></li>
              <li><Link href="/cgu" className="hover:text-white transition-colors">{t('terms')}</Link></li>
              <li><Link href="/confidentialite" className="hover:text-white transition-colors">{t('privacy')}</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-6 text-center text-sm text-white/40">
          {t('rights', { year: new Date().getFullYear() })}
        </div>
      </div>
    </footer>
  )
}
