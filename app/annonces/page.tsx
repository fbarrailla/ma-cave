import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { ListingCard } from '@/components/listings/ListingCard'
import { ListingFilters } from '@/components/listings/ListingFilters'
import type { ListingWithSeller } from '@/lib/supabase/types'

interface SearchParams {
  q?: string
  color?: string
  region?: string
  maxPrice?: string
  vintageMin?: string
  vintageMax?: string
  page?: string
}

const PAGE_SIZE = 12

export default async function AnnoncesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const page = parseInt(params.page || '1')
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from('listings')
    .select('*, profiles:seller_id(id, full_name, avatar_url, location)', { count: 'exact' })
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .range(from, to)

  if (params.q) {
    query = query.or(`title.ilike.%${params.q}%,producer.ilike.%${params.q}%,appellation.ilike.%${params.q}%,grape_variety.ilike.%${params.q}%`)
  }
  if (params.color) query = query.eq('color', params.color as 'rouge' | 'blanc' | 'rosé' | 'effervescent' | 'liquoreux')
  if (params.region) query = query.eq('region', params.region)
  if (params.maxPrice) query = query.lte('price', parseFloat(params.maxPrice))
  if (params.vintageMin) query = query.gte('vintage', parseInt(params.vintageMin))
  if (params.vintageMax) query = query.lte('vintage', parseInt(params.vintageMax))

  const { data: listings, count } = await query
  const totalPages = Math.ceil((count || 0) / PAGE_SIZE)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[#1a1209] mb-6">
        Explorer les annonces
        {count !== null && <span className="text-base font-normal text-gray-400 ml-2">({count} résultat{count !== 1 ? 's' : ''})</span>}
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar filters */}
        <aside className="md:w-64 flex-shrink-0">
          <Suspense>
            <ListingFilters />
          </Suspense>
        </aside>

        {/* Listings grid */}
        <div className="flex-1">
          {listings && listings.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {listings.map(l => (
                  <ListingCard key={l.id} listing={l as unknown as ListingWithSeller} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <a key={p} href={`?${new URLSearchParams({ ...params, page: p.toString() })}`}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${p === page ? 'bg-[#722f37] text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-[#722f37]'}`}>
                      {p}
                    </a>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-lg font-medium text-gray-600">Aucune annonce trouvée</p>
              <p className="text-sm mt-1">Essayez d'élargir vos critères de recherche</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
