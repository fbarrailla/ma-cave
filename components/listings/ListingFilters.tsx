'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { WINE_REGIONS, WINE_COLORS } from '@/lib/utils'
import { Search, SlidersHorizontal } from 'lucide-react'

export function ListingFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateParam = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page')
    router.push(`/annonces?${params.toString()}`)
  }, [router, searchParams])

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#f0e8d8] p-4">
      <div className="flex items-center gap-2 mb-4 text-[#722f37]">
        <SlidersHorizontal className="h-4 w-4" />
        <span className="font-semibold text-sm">Filtres</span>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher..."
          defaultValue={searchParams.get('q') || ''}
          onChange={e => updateParam('q', e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#722f37]/20 focus:border-[#722f37]"
        />
      </div>

      {/* Couleur */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Couleur</label>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => updateParam('color', '')}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${!searchParams.get('color') ? 'bg-[#722f37] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            Toutes
          </button>
          {WINE_COLORS.map(c => (
            <button
              key={c.value}
              onClick={() => updateParam('color', c.value)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${searchParams.get('color') === c.value ? 'bg-[#722f37] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Région */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Région</label>
        <select
          value={searchParams.get('region') || ''}
          onChange={e => updateParam('region', e.target.value)}
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#722f37]/20 focus:border-[#722f37]">
          <option value="">Toutes les régions</option>
          {WINE_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Prix */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Prix max (€)</label>
        <input
          type="number"
          placeholder="Ex: 100"
          defaultValue={searchParams.get('maxPrice') || ''}
          onChange={e => updateParam('maxPrice', e.target.value)}
          min="0"
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#722f37]/20 focus:border-[#722f37]"
        />
      </div>

      {/* Millésime */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Millésime</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="De"
            defaultValue={searchParams.get('vintageMin') || ''}
            onChange={e => updateParam('vintageMin', e.target.value)}
            min="1900" max={new Date().getFullYear()}
            className="w-1/2 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#722f37]/20 focus:border-[#722f37]"
          />
          <input
            type="number"
            placeholder="À"
            defaultValue={searchParams.get('vintageMax') || ''}
            onChange={e => updateParam('vintageMax', e.target.value)}
            min="1900" max={new Date().getFullYear()}
            className="w-1/2 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#722f37]/20 focus:border-[#722f37]"
          />
        </div>
      </div>
    </div>
  )
}
