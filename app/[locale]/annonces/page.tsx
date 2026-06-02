'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ListingCard } from '@/components/listings/ListingCard'
import { ListingFilters } from '@/components/listings/ListingFilters'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import type { ListingWithSeller } from '@/lib/supabase/types'

const PAGE_SIZE = 12

function AnnoncesContent() {
  const searchParams = useSearchParams()
  const t = useTranslations('listings')
  const [listings, setListings] = useState<ListingWithSeller[]>([])
  const [count, setCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  const page = parseInt(searchParams.get('page') || '1')
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  useEffect(() => {
    setLoading(true)
    const supabase = createClient()
    let query = supabase
      .from('listings')
      .select('*, profiles:seller_id(id, full_name, avatar_url, location)', { count: 'exact' })
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .range(from, to)

    const q = searchParams.get('q')
    const color = searchParams.get('color')
    const region = searchParams.get('region')
    const maxPrice = searchParams.get('maxPrice')
    const vintageMin = searchParams.get('vintageMin')
    const vintageMax = searchParams.get('vintageMax')

    if (q) query = query.or(`title.ilike.%${q}%,producer.ilike.%${q}%,appellation.ilike.%${q}%,grape_variety.ilike.%${q}%`)
    if (color) query = query.eq('color', color as 'rouge' | 'blanc' | 'rosé' | 'effervescent' | 'liquoreux')
    if (region) query = query.eq('region', region)
    if (maxPrice) query = query.lte('price', parseFloat(maxPrice))
    if (vintageMin) query = query.gte('vintage', parseInt(vintageMin))
    if (vintageMax) query = query.lte('vintage', parseInt(vintageMax))

    query.then(({ data, count: c }) => {
      setListings((data ?? []) as unknown as ListingWithSeller[])
      setCount(c)
      setLoading(false)
    })
  }, [searchParams.toString()])

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

  const buildPageUrl = (p: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', p.toString())
    return `/annonces?${params}`
  }

  const countText = count !== null
    ? count === 1 ? t('result', { count }) : t('results', { count })
    : null

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[#1a1209] mb-6">
        {t('title')}
        {countText && <span className="text-base font-normal text-gray-400 ml-2">({countText})</span>}
      </h1>
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="md:w-64 flex-shrink-0">
          <ListingFilters />
        </aside>
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-[#f0e8d8] h-64 animate-pulse" />
              ))}
            </div>
          ) : listings.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {listings.map(l => <ListingCard key={l.id} listing={l} />)}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <Link key={p} href={buildPageUrl(p)}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${p === page ? 'bg-[#722f37] text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-[#722f37]'}`}>
                      {p}
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-lg font-medium text-gray-600">{t('no_results')}</p>
              <p className="text-sm mt-1">{t('no_results_hint')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AnnoncesPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-8 animate-pulse h-96 bg-white rounded-xl" />}>
      <AnnoncesContent />
    </Suspense>
  )
}
