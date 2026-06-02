'use client'

import { Link } from '@/i18n/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ListingCard } from '@/components/listings/ListingCard'
import { Search, Shield, MessageSquare, TrendingUp } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { ListingWithSeller } from '@/lib/supabase/types'

const WINE_REGIONS_FEATURED = [
  { name: 'Bordeaux', emoji: '🏰', color: 'bg-red-50 hover:bg-red-100' },
  { name: 'Bourgogne', emoji: '🍇', color: 'bg-purple-50 hover:bg-purple-100' },
  { name: 'Champagne', emoji: '🥂', color: 'bg-yellow-50 hover:bg-yellow-100' },
  { name: 'Rhône', emoji: '⛰️', color: 'bg-orange-50 hover:bg-orange-100' },
  { name: 'Alsace', emoji: '🌿', color: 'bg-green-50 hover:bg-green-100' },
  { name: 'Loire', emoji: '🏡', color: 'bg-blue-50 hover:bg-blue-100' },
]

export default function HomePage() {
  const t = useTranslations('home')
  const [listings, setListings] = useState<ListingWithSeller[]>([])

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('listings')
      .select('*, profiles:seller_id(id, full_name, avatar_url, location)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(8)
      .then(({ data }) => setListings((data ?? []) as unknown as ListingWithSeller[]))
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-[#4a1d24] text-white overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            {t('hero_title1')}{' '}
            <span className="text-[#c9a84c]">{t('hero_title2')}</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            {t('hero_subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/annonces"
              className="flex items-center gap-2 bg-[#c9a84c] text-[#4a1d24] px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-[#e0bb5d] transition-colors shadow-lg">
              <Search className="h-5 w-5" />
              {t('cta_explore')}
            </Link>
            <Link href="/annonces/nouvelle"
              className="flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-white/20 transition-colors">
              {t('cta_sell')}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#722f37] text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-center gap-12 text-sm flex-wrap">
          <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-[#c9a84c]" /><span>{t('trust_secure')}</span></div>
          <div className="flex items-center gap-2"><MessageSquare className="h-4 w-4 text-[#c9a84c]" /><span>{t('trust_messaging')}</span></div>
          <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-[#c9a84c]" /><span>{t('trust_p2p')}</span></div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#1a1209] mb-6">{t('regions_title')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {WINE_REGIONS_FEATURED.map(r => (
              <Link key={r.name} href={`/annonces?region=${r.name}`}
                className={`${r.color} rounded-xl p-4 text-center transition-colors group`}>
                <div className="text-3xl mb-2">{r.emoji}</div>
                <div className="text-sm font-semibold text-gray-800 group-hover:text-[#722f37] transition-colors">{r.name}</div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#1a1209]">{t('latest_title')}</h2>
            <Link href="/annonces" className="text-[#722f37] hover:text-[#9b3d47] font-semibold text-sm transition-colors">
              {t('latest_see_all')}
            </Link>
          </div>
          {listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {listings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <div className="text-6xl mb-4">🍷</div>
              <p className="text-lg font-medium text-gray-600">{t('empty_first')}</p>
              <Link href="/annonces/nouvelle"
                className="mt-4 inline-block bg-[#722f37] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#9b3d47] transition-colors">
                {t('empty_cta')}
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
