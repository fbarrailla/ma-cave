'use client'

import { useRouter } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { WINE_REGIONS, WINE_COLORS } from '@/lib/utils'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function ListingFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('filters')
  const tc = useTranslations('colors')

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
        <span className="font-semibold text-sm">{t('title')}</span>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder={t('search_placeholder')}
          defaultValue={searchParams.get('q') || ''}
          onChange={e => updateParam('q', e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#722f37]/20 focus:border-[#722f37]"
        />
      </div>

      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{t('color')}</label>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => updateParam('color', '')}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${!searchParams.get('color') ? 'bg-[#722f37] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {t('all_colors')}
          </button>
          {WINE_COLORS.map(c => (
            <button
              key={c.value}
              onClick={() => updateParam('color', c.value)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${searchParams.get('color') === c.value ? 'bg-[#722f37] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {tc(c.value as 'rouge' | 'blanc' | 'rosé' | 'effervescent' | 'liquoreux')}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{t('region')}</label>
        <select
          value={searchParams.get('region') || ''}
          onChange={e => updateParam('region', e.target.value)}
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#722f37]/20 focus:border-[#722f37]">
          <option value="">{t('all_regions')}</option>
          {WINE_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{t('max_price')}</label>
        <input
          type="number"
          placeholder={t('price_placeholder')}
          defaultValue={searchParams.get('maxPrice') || ''}
          onChange={e => updateParam('maxPrice', e.target.value)}
          min="0"
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#722f37]/20 focus:border-[#722f37]"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{t('vintage')}</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder={t('from')}
            defaultValue={searchParams.get('vintageMin') || ''}
            onChange={e => updateParam('vintageMin', e.target.value)}
            min="1900" max={new Date().getFullYear()}
            className="w-1/2 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#722f37]/20 focus:border-[#722f37]"
          />
          <input
            type="number"
            placeholder={t('to')}
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
